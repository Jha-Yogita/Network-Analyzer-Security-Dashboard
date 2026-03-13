from app import socketio, db
from app.packet_capture import capture_packets
from app.models import PacketSnapshot
from flask_socketio import emit
from flask import current_app
import threading
import time

capture_active = False
capture_thread = None

def background_packet_capture(app):
    global capture_active
    
    print("Starting background packet capture...")
    
    with app.app_context():
        while capture_active:
            try:
                data = capture_packets()
                
                snapshot = PacketSnapshot.from_capture_data(data)
                db.session.add(snapshot)
                db.session.commit()
                
                socketio.emit('packet_update', data, namespace='/network')
                
                if data.get('alerts'):
                    socketio.emit('security_alert', {
                        'alerts': data['alerts'],
                        'count': len(data['alerts'])
                    }, namespace='/network')
                
                time.sleep(2)
                
            except Exception as e:
                print(f"Error in background capture: {e}")
                db.session.rollback()
                time.sleep(2)
    
    print("Background packet capture stopped")


@socketio.on('connect', namespace='/network')
def handle_connect():
    global capture_active, capture_thread
    
    print('Client connected')
    
    if not capture_active:
        capture_active = True
        app = current_app._get_current_object()
        capture_thread = threading.Thread(target=background_packet_capture, args=(app,))
        capture_thread.daemon = True
        capture_thread.start()
    
    try:
        data = capture_packets()
        emit('packet_update', data)
    except Exception as e:
        print(f"Error sending initial data: {e}")


@socketio.on('disconnect', namespace='/network')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('request_snapshot', namespace='/network')
def handle_snapshot_request():
    try:
        data = capture_packets()
        emit('packet_update', data)
    except Exception as e:
        emit('error', {'message': str(e)})


@socketio.on('pause_capture', namespace='/network')
def handle_pause():
    global capture_active
    capture_active = False
    emit('capture_status', {'active': False})


@socketio.on('resume_capture', namespace='/network')
def handle_resume():
    global capture_active, capture_thread
    
    if not capture_active:
        capture_active = True
        app = current_app._get_current_object()
        capture_thread = threading.Thread(target=background_packet_capture, args=(app,))
        capture_thread.daemon = True
        capture_thread.start()
    
    emit('capture_status', {'active': True})