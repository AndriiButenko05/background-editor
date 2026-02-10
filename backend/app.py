from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image 
import io

app = Flask(__name__)
CORS(app)
def replace_transparent_with_color(image_rgba, color=(128, 128, 128)):

    background = Image.new("RGB", image_rgba.size, color)

    background.paste(image_rgba, (0, 0), image_rgba)
    
    return background



@app.route('/api/remove-bg', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return {'error': 'No file'}, 400
    
    file = request.files['file']
    mode = request.form.get('mode')

    input_image = Image.open(file.stream)
    transparent_image = remove(input_image)

    final_image = transparent_image
    if mode == 'make-grey':
        final_image = replace_transparent_with_color(transparent_image, color=(128, 128, 128))
    
    img_io = io.BytesIO()
    final_image.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=5000)