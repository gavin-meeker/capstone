import os
import re
import validators

from tld import get_tld, get_fld
'''from pybloomfilter import BloomFilter'''
from pybloom_live import BloomFilter

from flask import request
from flask_restful import reqparse
from .auth import AuthenticatedResource

# Extract and refang a list of IOCs from free form text
class IOCExtractor(AuthenticatedResource):
    def __init__(self, internal_host_prefixes=[], dictionary_source_file=None, dictionary_bloom_file=None):
        # The internal prefix list helps us pick out hostnames that match our
        # internal naming convention even when the hostname has no domain name
        # attached
        self.internal_host_prefixes = set()
        for prefix in internal_host_prefixes:
            self.internal_host_prefixes.add(prefix.lower())

        # Using a bloom filter loaded with a dictionary of english words helps
        # us pick out strings that might be usernames while filtering out other
        # words.
        self.filter = None
        if os.path.exists(dictionary_bloom_file):
            # If we already have a bloom filter created, load it
            self.filter = BloomFilter.open(dictionary_bloom_file)
        elif os.path.exists(dictionary_source_file):
            # If we don't have an existing bloom filter, create one from a
            # plain text dictionary
            self.filter = BloomFilter(dictionary_bloom_size, dictionary_bloom_error_rate, dictionary_bloom_file)
            with open(args.dictionary_file, 'r') as f:
                for line in f:
                    self.filter.add(line.lower().rstrip())
        else:
            print("Warning: neither a dictionary bloom file nor a dictionary source file is available.  Username detection will be limited.")

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('defang', default=False, location="args")
        parser.add_argument('raw', default=None, location="args")
        args = parser.parse_args()
        
        if request.content_type == 'text/plain':
            text = request.data.decode('utf-8').rstrip()
        else:
            return { 'error' : "Content-type must be text/plain" }, 400

        data = self.extract_iocs(text, args.defang)

        # Raw output just returns the IOCs
        if args.raw != None:
            data = [ x['threat']['indicator']['description'] for x in data ]

        if data:            
            return { 'data' : data }, 200
        else:
            return { 'data' : data }, 404

    def extract_iocs(self, text, defang=False):
        iocs = []

        for line in text.split("\n"):
            # Strip leading/trailing whitespace
            line = line.strip()

            # Refang indicators
            line = self.refang(line)

            # Extract IPs
            # Make a regular expression for extracting IPv4
            ipv4 = re.compile(r"""(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:
                        25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:
                        25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:
                        25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)""")
             
            # Make a regular expression for extracting IPv6
            ipv6 = re.compile(r"[a-f\d]{1,4}:[a-f\d:]+\d")

            for ip in re.findall(ipv4, line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'ip' : ip,
                            'type' : 'ipv4-addr',
                            'description' : ip
                            }
                        }
                    })            
            for ip in re.findall(ipv6, line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'ip' : ip,
                            'type' : 'ipv6-addr',
                            'description' : ip
                            }
                        }
                    })
            # Extract URLs
            if re.search(r'https?://', line):
                # http://blah.com/blah
                for url in re.findall(r'https?://\S+', line):
                    iocs.append({
                        'threat' : {
                            'indicator' : {
                                'url' : url,
                                'type' : 'url',
                                'description' : url
                                }
                            }
                        })
            else:
                # blah.com/blah
                for url in re.findall(r'[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,}/\S+', line):
                    url = 'http://' + url
                    iocs.append({
                        'threat' : {
                            'indicator' : {
                                'url' : url,
                                'type' : 'url',
                                'description' : url
                                }
                            }
                        })

            # Extract hostnames
            for hostname in re.findall(r'[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,}', line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'domain-name' : hostname,
                            'type' : 'domain-name',
                            'description' : hostname
                            }
                        }
                    })
            
            # Extract email addresses
            for email in re.findall(r'[\w\-\.\+]+@[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,}', line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'email' : {
                                'address' : email
                            },
                            'type' : 'email-addr',
                            'description' : email
                            }
                        }
                    })

            # Extract internal hostnames
            for token in line.split():
                prefix = token[:4].lower()
                if prefix in self.internal_host_prefixes:
                    iocs.append({
                        'threat' : {
                            'indicator' : {
                                'domain-name' : token,
                                'type' : 'domain-name',
                                'description' : token,
                                'extensions' : {
                                    'internal' : True
                                    }
                                }
                            }
                        })

            # Extract hashes
            # SHA256
            for _hash in re.findall(r'\b[a-fA-F0-9]{64}\b', line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'file',
                            'description' : _hash,
                            'file' : {
                                'hash' : {
                                    'sha256' : _hash
                                    }
                                }
                            }
                        }
                    })
            # SHA1
            for _hash in re.findall(r'\b[a-fA-F0-9]{40}\b', line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'file',
                            'description' : _hash,
                            'file' : {
                                'hash' : {
                                    'sha1' : _hash
                                    }
                                }
                            }
                        }
                    })
            # MD5
            for _hash in re.findall(r'\b[a-fA-F0-9]{32}\b', line):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'file',
                            'description' : _hash,
                            'file' : {
                                'hash' : {
                                    'md5' : _hash
                                    }
                                }
                            }
                        }
                    })

            # Extract usernames
            # Explicit domain\user
            for username in re.findall(r'\bcorp\\([a-z][a-z0-9]+)', line, re.IGNORECASE):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'user-account',
                            'description' : username,
                            'user-account' : username,
                            'type' : 'user-account'
                        }
                    }
                })
            # Contractor, e.g. b12345 or c12345
            for username in re.findall(r'\b([bc]\d{5})\b', line, re.IGNORECASE):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'user-account',
                            'description' : username,
                            'user-account' : username,
                            'type' : 'user-account'
                        }
                    }
                })
            # Service account, e.g. a1ServiceAccount
            for username in re.findall(r'\b(a1[a-z\d]+)', line, re.IGNORECASE):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'user-account',
                            'description' : username,
                            'user-account' : username,
                            'type' : 'user-account'
                        }
                    }
                })
            # PAM account, e.g. p1josmith or p5josmith
            for username in re.findall(r'\b(p[15][a-z\d]+)', line, re.IGNORECASE):
                iocs.append({
                    'threat' : {
                        'indicator' : {
                            'type' : 'user-account',
                            'description' : username,
                            'user-account' : username,
                            'type' : 'user-account'
                        }
                    }
                })
            # Strings that could potentially be usernames
            # 5-8 characters long, and the last character may be a digit
            # E.g. josmith, jadoe2
            # Skip this step if we don't have a bloom filter to eliminate
            # common dicionary words
            if self.filter:
                for username in re.findall(r'\b([a-z]{4,7}[a-z\d])\b', line, re.IGNORECASE):
                    # Ignore dictionary words
                    if username.lower() not in self.filter:
                        iocs.append({
                            'threat' : {
                                'indicator' : {
                                    'type' : 'user-account',
                                    'description' : username,
                                    'user-account' : username,
                                    'type' : 'user-account'
                                }
                            }
                        })
        # Validate and return the data
        seen = set()
        validated_iocs = []
        for ioc in iocs:
            _type = ioc['threat']['indicator']['type']
            description = ioc['threat']['indicator']['description']
            # Use a set() for deduplication
            if description.lower() in seen:
                continue
            seen.add(description.lower())
            if _type == 'ipv4-addr' and validators.ipv4(description):
                validated_iocs.append(ioc)
            elif _type == 'ipv6-addr' and validators.ipv6(description):
                validated_iocs.append(ioc)
            elif _type == 'email-addr':
                username, hostname = description.split('@', 2)
                tld = get_tld(hostname, fail_silently=True, fix_protocol=True)
                fld = get_fld(hostname, fail_silently=True, fix_protocol=True)
                if not validators.domain(hostname) or not tld or not fld:
                    continue
                validated_iocs.append(ioc)
            elif _type == 'url' and validators.url(description):
                validated_iocs.append(ioc)
                # Extract the hostname from the URL
                m = re.search(r'https?://([^/:]+)[/:]', description)
                if m:
                    hostname = m.group(1)
                    if hostname not in seen:
                        validated_iocs.append({
                            'threat' : {
                                'indicator' : {
                                    'domain-name' : hostname,
                                    'type' : 'domain-name',
                                    'description' : hostname
                                    }
                                }
                            })
                        seen.add(hostname.lower())
            elif _type == 'domain-name':
                tld = get_tld(description, fail_silently=True, fix_protocol=True)
                fld = get_fld(description, fail_silently=True, fix_protocol=True)
                if validators.domain(description) and tld and fld:
                    validated_iocs.append(ioc)
                else:
                    # Is this an internal hostname without a FQDN?
                    extensions = ioc['threat']['indicator'].get('extensions', {})
                    if extensions.get('internal', False):
                        validated_iocs.append(ioc)
            elif _type == 'file':
                validated_iocs.append(ioc)
            elif _type == 'user-account':
                validated_iocs.append(ioc)

        # Defang the output?
        if defang:
            for ioc in validated_iocs:
                if ioc['threat']['indicator']['type'] in ['ipv4-addr', 'ipv6-addr', 'url', 'domain-name']:
                    ioc = self.defang(ioc)
        return validated_iocs

    def refang(self, ioc):
        # Turn www[dot]site[dot]com into www.site.com
        ioc = ioc.replace("[dot]", ".")
        # Turn www(dot)site(dot)com into www.site.com
        ioc = ioc.replace("(dot)", ".")
        # Turn 1.2.3[,]4 into 1.2.3.4
        ioc = ioc.replace("[,]", ".")
        # Turn 1.2.3[.]4 into 1.2.3.4
        ioc = ioc.replace("[.]", ".")
        # Turn bad.guy .com into bad.guy.com
        ioc = ioc.replace(" .", ".")
        # Turn hxxp into http
        ioc = ioc.replace("hxxp", "http")
        return ioc

    def defang(self, ioc):
        # Assign these here just to make the code more readable
        _type = ioc['threat']['indicator']['type']
        description = ioc['threat']['indicator']['description']

        if _type == 'url':
            # Replace http with hxxp, and replace the last dot with [.]
            description = re.sub(r'http(s?)://([^/]+)\.', r'hxxp\1://\2[.]', description)
        elif _type == 'ipv4-addr' or _type == 'domain-name':
            # Replace the last dot with [.]
            description = re.sub(r'(.*)\.', r'\1[.]', description)
        elif _type == 'ipv6-addr':
            # Replace the last colon with [:]
            description = re.sub(r'(.*)\:', r'\1[:]', description)

        ioc['threat']['indicator']['description'] = description
        return ioc

