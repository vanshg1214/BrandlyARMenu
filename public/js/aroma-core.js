// ── More Aggressive Slam-Grid Killer ─────────────
AFRAME.registerComponent('slam-grid-killer', {
  init: function() {
    const killGrid = () => {
      const grids = document.querySelectorAll('[xrextras-slam-grid], #slam-grid, .xrextras-slam-grid');
      grids.forEach(g => {
        if (g.parentNode) g.parentNode.removeChild(g);
      });
      const scene = this.el.sceneEl;
      if (scene && scene.object3D) {
        scene.object3D.traverse((obj) => {
          if (obj.name && obj.name.toLowerCase().includes('slam-grid')) {
            obj.visible = false;
            if (obj.material) {
              obj.material.visible = false;
              obj.material.opacity = 0;
            }
          }
        });
      }
    };
    this.el.addEventListener('realityready', killGrid);
    setInterval(killGrid, 100);
  }
});

var params = new URLSearchParams(window.location.search);
var modelUrl = params.get('model') || '';
var dishName = params.get('name') || 'Dish';

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('dishBadge').textContent = dishName;
  if (!modelUrl) {
    document.getElementById('errorPanel').classList.add('visible');
    document.getElementById('promptText').classList.add('hidden');
    document.getElementById('spiegel-loader').classList.add('hidden');
  }
});

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', function() {
  var startBtn = document.getElementById('startArBtn');
  var startBox = document.getElementById('spiegel-start-box');
  var loadBox = document.getElementById('spiegel-load-box');

  if (!startBtn) return;

  startBtn.addEventListener('click', function () {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(function (permissionState) {
          if (permissionState === 'granted') {
            startAR();
          } else {
            alert("Motion sensors are required for AR to work. Please navigate to settings and allow motion access.");
          }
        })
        .catch(function (error) {
          console.error("DeviceMotion Error:", error);
          startAR();
        });
    } else {
      startAR();
    }
  });

  function startAR() {
    if (!modelUrl) return;
    startBox.style.display = 'none';
    loadBox.style.display = 'flex';

    var template = document.getElementById('scene-template');
    document.body.appendChild(template.content.cloneNode(true));
    
    var sceneEl = document.querySelector('a-scene');

    var fallbackTimer = setTimeout(function() {
      if (!window.arReady) {
         document.getElementById('spiegel-loader').classList.add('hidden');
         document.getElementById('fallbackPanel').classList.add('visible');
      }
    }, 15000); 

    sceneEl.addEventListener('realityready', function() {
      window.arReady = true;
      clearTimeout(fallbackTimer);
      var loader = document.getElementById('spiegel-loader');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(function() { loader.remove(); }, 500);
      }
    });

    if (!isMobile) {
      sceneEl.addEventListener('loaded', () => {
        const envEl = document.createElement('a-entity');
        envEl.innerHTML = `
          <a-sky color="#1a1a1a"></a-sky>
          <a-circle rotation="-90 0 0" radius="100" color="#333" metalness="0" roughness="1"></a-circle>
        `;
        sceneEl.appendChild(envEl);

        const camera = document.getElementById('camera');
        if (camera) {
          camera.setAttribute('position', '0 8 8');
        }
      });
    }
  }
});

document.getElementById('backBtn').addEventListener('click', function () {
  window.history.back();
});
document.getElementById('doneBtn').addEventListener('click', function () {
  window.history.back();
});

document.getElementById('useFallbackBtn').addEventListener('click', function() {
   var fallbackUrl = '/model-render.html' + window.location.search;
   window.location.href = fallbackUrl;
});

var hasShownToast = false;
function showPlacedToast() {
  if (hasShownToast) return;
  hasShownToast = true;
  var toast = document.getElementById('placedToast');
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 2500);
}

AFRAME.registerComponent('tap-place-dish', {
  init: function () {
    var self = this;
    var ground = document.getElementById('ground');
    var prompt = document.getElementById('promptText');
    var bottomBar = document.getElementById('bottomBar');
    var resetBtn = document.getElementById('resetBtn');
    var currentModel = null;
    var isModelLoading = false;

    ground.addEventListener('click', function (event) {
      if (!modelUrl || isModelLoading) return;
      if (!event.detail || !event.detail.intersection) return;
      var touchPoint = event.detail.intersection.point;

      if (currentModel) return;

      isModelLoading = true;
      prompt.classList.add('hidden');

      var wrapper = document.createElement('a-entity');
      wrapper.setAttribute('position', touchPoint);
      wrapper.classList.add('cantap');
      wrapper.setAttribute('xrextras-two-finger-rotate', '');
      wrapper.setAttribute('xrextras-pinch-scale', 'min: 0.1; max: 8.0');
      wrapper.setAttribute('xrextras-hold-drag', '');

      var el = document.createElement('a-entity');
      el.setAttribute('shadow', 'receive: false');
      el.setAttribute('scale', '1 1 1');
      el.setAttribute('gltf-model', encodeURI(modelUrl));

      wrapper.appendChild(el);
      self.el.sceneEl.appendChild(wrapper);
      currentModel = wrapper;

      el.addEventListener('model-loaded', function () {
        isModelLoading = false;
        el.object3D.updateWorldMatrix(true, true);
        
        var box = new THREE.Box3().setFromObject(el.object3D);
        var size = new THREE.Vector3();
        box.getSize(size);

        var scaleFactor = 1;
        var maxDim = Math.max(size.x, size.y, size.z);

        if (maxDim > 0.001) {
          var targetSize = 0.91875;
          scaleFactor = targetSize / maxDim;
        } else {
          scaleFactor = 0.01;
        }

        var yOffset = ((-box.min.y) * scaleFactor) + 0.30;
        el.setAttribute('position', '0 ' + yOffset + ' 0');

        el.setAttribute('scale', '0.001 0.001 0.001');
        el.setAttribute('animation', {
          property: 'scale',
          to: scaleFactor + ' ' + scaleFactor + ' ' + scaleFactor,
          easing: 'easeOutElastic',
          dur: 800,
        });

        bottomBar.classList.add('visible');
        showPlacedToast();
      });
    });

    resetBtn.addEventListener('click', function () {
      if (currentModel) {
        currentModel.parentNode.removeChild(currentModel);
        currentModel = null;
        isModelLoading = false;
        prompt.classList.remove('hidden');
        bottomBar.classList.remove('visible');
      }
    });
  }
});
