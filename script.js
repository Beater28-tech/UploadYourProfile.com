const photoInput = document.getElementById('photoInput');
const frameInput = document.getElementById('frameInput');
const previewImage = document.getElementById('previewImage');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const zoomSlider = document.getElementById('zoomSlider');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let cropper;
let frameImage = null;

// Upload frame first
frameInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      frameImage = img;
      statusText.textContent = '✅ Frame uploaded! Now upload your photo.';
      photoInput.disabled = false;
    };
    img.src = URL.createObjectURL(file);
  }
});

// Upload photo
photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!frameImage) {
    alert("Please upload a frame first.");
    return;
  }

  if (file) {
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = 'block';

    previewImage.onload = () => {
      if (cropper) cropper.destroy();
      cropper = new Cropper(previewImage, {
        aspectRatio: 1,
        viewMode: 0, // allow full zoom out
        dragMode: 'move',
        autoCropArea: 1,
        ready() {
          zoomSlider.style.display = 'block';
          zoomSlider.value = 1;
        }
      });
    };

    cropBtn.style.display = 'inline-block';
    statusText.textContent = 'Step 3: Adjust & crop your photo.';
  }
});

// Zoom control
zoomSlider.addEventListener('input', function () {
  if (cropper) {
    cropper.zoomTo(parseFloat(this.value));
  }
});

// Crop and combine
cropBtn.addEventListener('click', function () {
  if (!cropper || !frameImage) {
    alert('Please upload both photo and frame.');
    return;
  }

  const croppedCanvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 400, 400, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(croppedCanvas, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

  canvas.style.display = 'block';
  downloadBtn.style.display = 'inline-block';
  statusText.textContent = '✅ Final image ready!';
});

// Download final
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'framed-photo.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});