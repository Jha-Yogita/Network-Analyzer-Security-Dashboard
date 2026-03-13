from flask import Blueprint, jsonify, request
from app.packet_capture import capture_packets
from app.models import PacketSnapshot, SecurityAlert
from app import db
from datetime import datetime, timedelta

api_bp = Blueprint('api', __name__)

@api_bp.route('/live', methods=['GET'])
def get_live_data():
    """Get current live packet data"""
    data = capture_packets()
    
   
    snapshot = PacketSnapshot.from_capture_data(data)
    db.session.add(snapshot)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error saving snapshot: {e}")
    
    return jsonify(data)


@api_bp.route('/history', methods=['GET'])
def get_history():
    """Get historical packet data"""
   
    hours = request.args.get('hours', default=24, type=int)
    limit = request.args.get('limit', default=100, type=int)
    
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    snapshots = PacketSnapshot.query\
        .filter(PacketSnapshot.timestamp >= start_time)\
        .order_by(PacketSnapshot.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return jsonify({
        'snapshots': [s.to_dict() for s in snapshots],
        'count': len(snapshots)
    })


@api_bp.route('/stats', methods=['GET'])
def get_statistics():
    """Get aggregated statistics"""
    hours = request.args.get('hours', default=24, type=int)
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    snapshots = PacketSnapshot.query\
        .filter(PacketSnapshot.timestamp >= start_time)\
        .all()
    
    if not snapshots:
        return jsonify({
            'total_packets': 0,
            'avg_packets_per_minute': 0,
            'protocol_distribution': {'TCP': 0, 'UDP': 0, 'ICMP': 0}
        })
    
    total_packets = sum(s.total_packets for s in snapshots)
    total_tcp = sum(s.tcp_count for s in snapshots)
    total_udp = sum(s.udp_count for s in snapshots)
    total_icmp = sum(s.icmp_count for s in snapshots)
    
    time_diff = (datetime.utcnow() - snapshots[-1].timestamp).total_seconds() / 60
    avg_per_minute = total_packets / time_diff if time_diff > 0 else 0
    
    return jsonify({
        'total_packets': total_packets,
        'avg_packets_per_minute': round(avg_per_minute, 2),
        'protocol_distribution': {
            'TCP': total_tcp,
            'UDP': total_udp,
            'ICMP': total_icmp
        },
        'time_range_hours': hours
    })


@api_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Get security alerts"""
    hours = request.args.get('hours', default=24, type=int)
    resolved = request.args.get('resolved', default='false', type=str)
    
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    query = SecurityAlert.query.filter(SecurityAlert.timestamp >= start_time)
    
    if resolved.lower() == 'false':
        query = query.filter(SecurityAlert.is_resolved == False)
    
    alerts = query.order_by(SecurityAlert.timestamp.desc()).all()
    
    return jsonify({
        'alerts': [a.to_dict() for a in alerts],
        'count': len(alerts)
    })


@api_bp.route('/alerts/<int:alert_id>/resolve', methods=['POST'])
def resolve_alert(alert_id):
    """Mark an alert as resolved"""
    alert = SecurityAlert.query.get_or_404(alert_id)
    alert.is_resolved = True
    db.session.commit()
    
    return jsonify({'success': True, 'alert': alert.to_dict()})