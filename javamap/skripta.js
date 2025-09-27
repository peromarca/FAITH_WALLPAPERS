const images = [
   // WP series - updated to match current file names
   'wp 01.png', 'wp 02.png', 'wp 03.png', 'wp 04.png', 'wp 05.png', 'wp 06.png', 'wp 07.png', 'wp 08.png', 'wp 09.png', 'wp 10.png',
   'wp 11.png', 'wp 12.png', 'wp 13.png', 'wp 14.png', 'wp 15.png', 'wp 16.png', 'wp 17.png', 'wp 18.png', 'wp 19.png', 'wp 20.png',
   'wp 21.png', 'wp 22.png', 'wp 23.png', 'wp 24.png', 'wp 25.png', 'wp 26.png', 'wp 27.png', 'wp 28.png', 'wp 29.png', 'wp 30.png',
   'wp 31.png', 'wp 32.png', 'wp 33.png', 'wp 34.png', 'wp 35.png', 'wp 36.png', 'wp 37.png', 'wp 38.png', 'wp 39.png', 'wp 40.png',
   'wp 41.png', 'wp 42.png', 'wp 43.png', 'wp 44.png', 'wp 45.png', 'wp 46.png', 'wp 47.png', 'wp 48.png', 'wp 49.png', 'wp 50.png',
   'wp 51.png', 'wp 52.png', 'wp 53.png', 'wp 54.png', 'wp 55.png', 'wp 56.png', 'wp 57.png', 'wp 58.png', 'wp 59.png', 'wp 60.png',
   'wp 61.png', 'wp 62.png', 'wp 63.png', 'wp 64.png', 'wp 65.png', 'wp 66.png', 'wp 67.png', 'wp 68.png', 'wp 69.png', 'wp 70.png',
   'wp 71.png', 'wp 72.png', 'wp 73.png', 'wp 74.png', 'wp 75.png', 'wp 76.png', 'wp 77.png', 'wp 78.png', 'wp 79.png', 'wp 80.png',
   'wp 81.png', 'wp 82.png', 'wp 83.png', 'wp 84.png', 'wp 85.png', 'wp 86.png', 'wp 87.png', 'wp 88.png', 'wp 89.png', 'wp 90.png',
   'wp 91.png', 'wp 92.png', 'wp 93.png', 'wp 94.png', 'wp 95.png', 'wp 96.png', 'wp 97.png', 'wp 98.png', 'wp 99.png', 'wp 100.png'
];

let currentImages = [...images];
let currentImageIndex = 0;
let currentPage = 1;
const imagesPerPage = 20; // Load 20 images at a time

// DOM elements
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close');
const downloadBtn = document.getElementById('downloadBtn');
const viewFullBtn = document.getElementById('viewFullBtn');
const shareBtn = document.getElementById('shareBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const scrollTopBtn = document.getElementById('scrollTop');
const totalImagesEl = document.getElementById('totalImages');

// Initialize
document.addEventListener('DOMContentLoaded', function () {
   updateStats();         // Prvo pokaži brojač
   setupEventListeners(); // Postaviti kontrole
   loadGallery();         // Na kraju učitaj galeriju (najsporije)
});

function updateStats() {
   totalImagesEl.textContent = `🎨 ${images.length} Premium Wallpapers Available for Download`;
}

function loadGallery() {
   loading.style.display = 'block';
   gallery.innerHTML = '';

   // Load only first batch of images for faster initial load
   const startIndex = 0;
   const endIndex = Math.min(imagesPerPage, currentImages.length);
   const imagesToLoad = currentImages.slice(startIndex, endIndex);

   // Load images one by one with small delay for smoother experience
   imagesToLoad.forEach((image, index) => {
      setTimeout(() => {
         const galleryItem = createGalleryItem(image, index);
         gallery.appendChild(galleryItem);

         // Hide loading when first few images are loaded
         if (index === 4) { // Hide loading after 5 images
            loading.style.display = 'none';
         }
      }, index * 30); // 30ms delay between each image
   });

   // Add "Load More" button after all initial images are loaded
   setTimeout(() => {
      if (endIndex < currentImages.length) {
         addLoadMoreButton();
      }
   }, imagesToLoad.length * 30 + 100);
}

function addLoadMoreButton() {
   const loadMoreBtn = document.createElement('div');
   loadMoreBtn.className = 'load-more-container';
   loadMoreBtn.innerHTML = `
      <button class="load-more-btn" onclick="loadMoreImages()">
         📁 Load More Wallpapers (${currentImages.length - (currentPage * imagesPerPage)} remaining)
      </button>
   `;
   gallery.appendChild(loadMoreBtn);
}

function loadMoreImages() {
   const startIndex = currentPage * imagesPerPage;
   const endIndex = Math.min(startIndex + imagesPerPage, currentImages.length);
   const imagesToLoad = currentImages.slice(startIndex, endIndex);

   // Remove load more button
   const loadMoreContainer = document.querySelector('.load-more-container');
   if (loadMoreContainer) {
      loadMoreContainer.remove();
   }

   imagesToLoad.forEach((image, index) => {
      const galleryItem = createGalleryItem(image, startIndex + index);
      gallery.appendChild(galleryItem);
   });

   currentPage++;

   // Add new load more button if needed
   if (endIndex < currentImages.length) {
      addLoadMoreButton();
   }
}

function createGalleryItem(imageName, index) {
   const item = document.createElement('div');
   item.className = 'gallery-item';
   item.dataset.category = getCategory(imageName);

   const imageTitle = formatImageName(imageName);
   const imagePath = `images/FAITH PNG/${imageName}`;

   item.innerHTML = `
                <img src="${imagePath}" alt="${imageTitle}" loading="lazy" decoding="async">
                <div class="gallery-item-info">
                    <h3>${imageTitle}</h3>
                    <p>High Quality PNG • Ready to Download</p>
                    <button class="download-btn" onclick="downloadImage('${imagePath}', '${imageName}')">
                        ⬇️ Download
                    </button>
                </div>
            `;

   // Open modal on click
   item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('download-btn')) {
         openModal(index);
      }
   });

   return item;
}

function getCategory(imageName) {
   if (imageName.startsWith('wp')) return 'wp';
   if (/^\d+\.png$/.test(imageName)) return 'numbered';
   return 'other';
}

function formatImageName(imageName) {
   const name = imageName.replace('.png', '');
   if (name.startsWith('wp')) {
      const num = name.replace('wp', '');
      return `FAITH WP #${num}`;
   } else if (/^\d+$/.test(name)) {
      return `FAITH Wallpaper #${name}`;
   }
   return `FAITH ${name}`;
}

function setupEventListeners() {
   // Filter buttons
   document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
         // Update active button
         document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
         e.target.classList.add('active');

         // Filter images
         const filter = e.target.dataset.filter;
         filterImages(filter);
      });
   });

   // Modal controls
   closeBtn.addEventListener('click', closeModal);
   modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
   });

   downloadBtn.addEventListener('click', () => {
      const currentImage = currentImages[currentImageIndex];
      downloadImage(`images/FAITH PNG/${currentImage}`, currentImage);
   });

   viewFullBtn.addEventListener('click', () => {
      const currentImage = currentImages[currentImageIndex];
      window.open(`images/FAITH PNG/${currentImage}`, '_blank');
   });

   shareBtn.addEventListener('click', () => {
      if (navigator.share) {
         const currentImage = currentImages[currentImageIndex];
         navigator.share({
            title: formatImageName(currentImage),
            text: 'Check out this amazing FAITH wallpaper!',
            url: window.location.href
         });
      } else {
         // Fallback - copy URL to clipboard
         navigator.clipboard.writeText(window.location.href);
         alert('Link copied to clipboard!');
      }
   });

   prevBtn.addEventListener('click', showPrevImage);
   nextBtn.addEventListener('click', showNextImage);

   // Keyboard navigation
   document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'block') {
         if (e.key === 'Escape') closeModal();
         if (e.key === 'ArrowLeft') showPrevImage();
         if (e.key === 'ArrowRight') showNextImage();
      }
   });

   // Scroll to top
   window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
         scrollTopBtn.classList.add('show');
      } else {
         scrollTopBtn.classList.remove('show');
      }
   });

   scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   });
}

function filterImages(filter) {
   if (filter === 'all') {
      currentImages = [...images];
   } else {
      currentImages = images.filter(img => getCategory(img) === filter);
   }
   currentPage = 1; // Reset pagination
   loadGallery();
}

function openModal(index) {
   currentImageIndex = index;
   const imageName = currentImages[index];
   const imagePath = `images/FAITH PNG/${imageName}`;

   modalImage.src = imagePath;
   modalTitle.textContent = formatImageName(imageName);
   modal.style.display = 'block';
   document.body.style.overflow = 'hidden';

   // Update navigation buttons
   prevBtn.style.display = index > 0 ? 'block' : 'none';
   nextBtn.style.display = index < currentImages.length - 1 ? 'block' : 'none';
}

function closeModal() {
   modal.style.display = 'none';
   document.body.style.overflow = 'auto';
}

function showPrevImage() {
   if (currentImageIndex > 0) {
      openModal(currentImageIndex - 1);
   }
}

function showNextImage() {
   if (currentImageIndex < currentImages.length - 1) {
      openModal(currentImageIndex + 1);
   }
}

function downloadImage(imagePath, imageName) {
   const link = document.createElement('a');
   link.href = imagePath;
   link.download = imageName;
   link.target = '_blank';
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);

   // Show download notification
   showNotification(`📁 ${formatImageName(imageName)} downloaded!`);
}

function showNotification(message) {
   const notification = document.createElement('div');
   notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #2ed573, #1e90ff);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(46, 213, 115, 0.3);
                z-index: 10000;
                font-weight: bold;
                animation: slideInRight 0.5s ease;
            `;
   notification.textContent = message;

   document.body.appendChild(notification);

   setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => {
         document.body.removeChild(notification);
      }, 500);
   }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
document.head.appendChild(style);