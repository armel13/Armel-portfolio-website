import os
import json
import uuid
from flask import Flask, render_template, request, flash, redirect, url_for, session

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key_for_dev') # Required for flash messages
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024 # 5MB max-limit for all uploads to be safe, CV specifically is 5MB

ALLOWED_PHOTO_EXTENSIONS = {'jpg', 'jpeg', 'png'}
ALLOWED_CV_EXTENSIONS = {'pdf'}

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def load_data():
    if os.path.exists('data.json'):
        with open('data.json', 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return {}
    return {}

def save_data(data):
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def index():
    data = load_data()
    profile_photo = data.get('profile_photo')
    cv_path = data.get('cv_path')
    return render_template('index.html', profile_photo=profile_photo, cv_path=cv_path)

@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == os.environ.get('ADMIN_PASSWORD', 'admin123'):
            session['admin'] = True
            flash('Logged in as admin successfully.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid password.', 'error')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin', None)
    flash('Logged out successfully.', 'success')
    return redirect(url_for('index'))

@app.route('/upload', methods=['POST'])
def upload_file():
    if not session.get('admin'):
        flash('Unauthorized access.', 'error')
        return redirect(url_for('index'))

    # Load existing data to preserve unchanged fields
    data = load_data()

    # Handle Photo Upload
    if 'photo' in request.files:
        photo = request.files['photo']
        if photo and photo.filename != '':
            if allowed_file(photo.filename, ALLOWED_PHOTO_EXTENSIONS):
                # Check file size (2MB max for photo)
                photo.seek(0, os.SEEK_END)
                size = photo.tell()
                photo.seek(0)
                if size <= 2 * 1024 * 1024:
                    ext = photo.filename.rsplit('.', 1)[1].lower()
                    filename = f"photo_{uuid.uuid4().hex}.{ext}"
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    photo.save(filepath)
                    data['profile_photo'] = f"uploads/{filename}"
                    flash('Profile photo uploaded successfully!', 'success')
                else:
                    flash('Photo size must be less than 2MB.', 'error')
            else:
                flash('Invalid photo file type. Allowed: jpg, jpeg, png.', 'error')

    # Handle CV Upload
    if 'cv' in request.files:
        cv = request.files['cv']
        if cv and cv.filename != '':
            if allowed_file(cv.filename, ALLOWED_CV_EXTENSIONS):
                # Check file size (5MB max for CV) - Already limited by app.config['MAX_CONTENT_LENGTH']
                cv.seek(0, os.SEEK_END)
                size = cv.tell()
                cv.seek(0)
                if size <= 5 * 1024 * 1024:
                    ext = cv.filename.rsplit('.', 1)[1].lower()
                    filename = f"cv_{uuid.uuid4().hex}.{ext}"
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    cv.save(filepath)
                    data['cv_path'] = f"uploads/{filename}"
                    flash('CV uploaded successfully!', 'success')
                else:
                    flash('CV size must be less than 5MB.', 'error')
            else:
                flash('Invalid CV file type. Allowed: pdf.', 'error')

    save_data(data)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
