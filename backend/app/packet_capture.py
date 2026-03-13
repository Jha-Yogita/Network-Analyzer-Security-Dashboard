from scapy.all import sniff
from collections import defaultdict
from app.models import SecurityAlert
from app import db

def capture_packets(count=80):
    """Capture and analyze network packets"""
    try:
        packets = sniff(count=count, timeout=5)
    except Exception as e:
        print(f"Error capturing packets: {e}")
        return get_empty_data()

    protocol_count = {"TCP": 0, "UDP": 0, "ICMP": 0}
    src_ips = defaultdict(int)
    dst_ips = defaultdict(int)
    ports = defaultdict(int)
    
   
    syn_packets = defaultdict(int)
    packet_sizes = []

    for pkt in packets:
        
        if pkt.haslayer("TCP"):
            protocol_count["TCP"] += 1
            port = pkt["TCP"].dport
            ports[port] += 1
            
           
            if pkt["TCP"].flags == 'S':
                if pkt.haslayer("IP"):
                    syn_packets[pkt["IP"].src] += 1

        elif pkt.haslayer("UDP"):
            protocol_count["UDP"] += 1
            port = pkt["UDP"].dport
            ports[port] += 1

        elif pkt.haslayer("ICMP"):
            protocol_count["ICMP"] += 1

      
        if pkt.haslayer("IP"):
            src = pkt["IP"].src
            dst = pkt["IP"].dst
            src_ips[src] += 1
            dst_ips[dst] += 1
            packet_sizes.append(len(pkt))

   
    alerts = detect_anomalies(syn_packets, src_ips, packet_sizes)
    
   
    top_src = sorted(src_ips.items(), key=lambda x: x[1], reverse=True)[:5]
    top_dst = sorted(dst_ips.items(), key=lambda x: x[1], reverse=True)[:5]
    
   
    top_ports = dict(sorted(ports.items(), key=lambda x: x[1], reverse=True)[:10])

    return {
        "protocols": protocol_count,
        "top_source_ips": top_src,
        "top_destination_ips": top_dst,
        "ports": top_ports,
        "alerts": alerts,
        "total_packets": len(packets)
    }


def detect_anomalies(syn_packets, src_ips, packet_sizes):
    """Detect potential security threats"""
    alerts = []
    
   
    for ip, count in syn_packets.items():
        if count > 15:
            alert = SecurityAlert(
                alert_type='port_scan',
                severity='high',
                source_ip=ip,
                description=f'Possible port scan detected: {count} SYN packets from {ip}'
            )
            db.session.add(alert)
            alerts.append(alert.to_dict())
    
  
    for ip, count in src_ips.items():
        if count > 50:
            alert = SecurityAlert(
                alert_type='high_traffic',
                severity='medium',
                source_ip=ip,
                description=f'Unusually high traffic from {ip}: {count} packets'
            )
            db.session.add(alert)
            alerts.append(alert.to_dict())
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error saving alerts: {e}")
    
    return alerts


def get_empty_data():
    """Return empty data structure when capture fails"""
    return {
        "protocols": {"TCP": 0, "UDP": 0, "ICMP": 0},
        "top_source_ips": [],
        "top_destination_ips": [],
        "ports": {},
        "alerts": [],
        "total_packets": 0
    }