// JavaScript for DNS Display Table

// Display Sample (Will replace will actual data fetching logic)
const dnsRecords = [
    { name: "ns2.brammer.us.u", address: "1.2.3.4", type: "A", firstSeen: "1/1/2025", lastSeen: "1/1/2025"},
    { name: "ns2.brammer.us.u", address: "1.2.3.4", type: "A", firstSeen: "1/1/2025", lastSeen: "1/1/2025"},
    { name: "ns2.brammer.us.u", address: "1.2.3.4", type: "A", firstSeen: "1/1/2025", lastSeen: "1/1/2025"},
    // 
];

const table = document.getElementById("dns-records");

dnsRecords.forEach(record => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${record.name}</td>
    <td>${record.address}</td>
    <td>${record.type}</td>
    <td>${record.firstSeen}</td>
    <td>${record.lastSeen}</td>
    `;
    tableBody.appendChild(row);
});