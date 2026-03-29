from gevent import monkey
monkey.patch_all()  

from app import create_app, db, socketio
from app.models import PacketSnapshot, SecurityAlert

app = create_app('development')

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'PacketSnapshot': PacketSnapshot,
        'SecurityAlert': SecurityAlert
    }

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)