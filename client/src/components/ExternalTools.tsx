export function ExternalTools(props: {
  threat: { indicator: { ip: string; type: string; description: string } };
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-sm text-blue-600 underline">
      <a
        target="_blank"
        href={`https://www.shodan.io/search?query=${props.threat.indicator.description}`}
        style={{ textDecoration: "underline", fontFamily: "monospace" }}
      >
        Shodan
      </a>
      <a
        target="_blank"
        href={`https://search.censys.io/hosts/${props.threat.indicator.description}`}
      >
        Censys
      </a>
      <a
        target="_blank"
        href={`https://spur.us/context/${props.threat.indicator.description}`}
      >
        Spur
      </a>
      <a
        target="_blank"
        href={`https://bgpview.io/ip/${props.threat.indicator.description}`}
      >
        BGPView
      </a>
    </div>
  );
}
