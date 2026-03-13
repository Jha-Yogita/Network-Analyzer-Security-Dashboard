from scapy.all import sniff

def capture_packets():
    packets = sniff(count=80)

    protocol_count = {"TCP": 0, "UDP": 0, "ICMP": 0}
    src_ips = {}
    dst_ips = {}
    ports = {}

    for pkt in packets:
    
        if pkt.haslayer("TCP"):
            protocol_count["TCP"] += 1
            port = pkt["TCP"].dport
            ports[port] = ports.get(port, 0) + 1

        elif pkt.haslayer("UDP"):
            protocol_count["UDP"] += 1
            port = pkt["UDP"].dport
            ports[port] = ports.get(port, 0) + 1

        elif pkt.haslayer("ICMP"):
            protocol_count["ICMP"] += 1

        
        if pkt.haslayer("IP"):
            src = pkt["IP"].src
            dst = pkt["IP"].dst

            src_ips[src] = src_ips.get(src, 0) + 1
            dst_ips[dst] = dst_ips.get(dst, 0) + 1

    
    top_src = sorted(src_ips.items(), key=lambda x: x[1], reverse=True)[:5]
    top_dst = sorted(dst_ips.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "protocols": protocol_count,
        "top_source_ips": top_src,
        "top_destination_ips": top_dst,
        "ports": ports
    }
