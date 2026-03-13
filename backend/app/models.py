from datetime import datetime
from app import db
import json

class PacketSnapshot(db.Model):
    """Stores periodic snapshots of network traffic"""
    __tablename__ = 'packet_snapshots'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
   
    tcp_count = db.Column(db.Integer, default=0)
    udp_count = db.Column(db.Integer, default=0)
    icmp_count = db.Column(db.Integer, default=0)
    total_packets = db.Column(db.Integer, default=0)
    
   
    top_source_ips = db.Column(db.Text)  
    top_destination_ips = db.Column(db.Text)  
    port_distribution = db.Column(db.Text)  
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'protocols': {
                'TCP': self.tcp_count,
                'UDP': self.udp_count,
                'ICMP': self.icmp_count
            },
            'total_packets': self.total_packets,
            'top_source_ips': json.loads(self.top_source_ips) if self.top_source_ips else [],
            'top_destination_ips': json.loads(self.top_destination_ips) if self.top_destination_ips else [],
            'ports': json.loads(self.port_distribution) if self.port_distribution else {}
        }
    
    @staticmethod
    def from_capture_data(data):
        """Create a snapshot from captured packet data"""
        return PacketSnapshot(
            tcp_count=data['protocols']['TCP'],
            udp_count=data['protocols']['UDP'],
            icmp_count=data['protocols']['ICMP'],
            total_packets=sum(data['protocols'].values()),
            top_source_ips=json.dumps(data['top_source_ips']),
            top_destination_ips=json.dumps(data['top_destination_ips']),
            port_distribution=json.dumps(data['ports'])
        )


class SecurityAlert(db.Model):
    """Stores security alerts and anomalies"""
    __tablename__ = 'security_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    alert_type = db.Column(db.String(50))  
    severity = db.Column(db.String(20))  
    source_ip = db.Column(db.String(45))
    description = db.Column(db.Text)
    is_resolved = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'type': self.alert_type,
            'severity': self.severity,
            'source_ip': self.source_ip,
            'description': self.description,
            'resolved': self.is_resolved
        }