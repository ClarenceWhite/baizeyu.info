document.addEventListener("DOMContentLoaded", function () {
    // 当用户点击图片时
    document.querySelectorAll('.content img').forEach(function (img) {
        img.addEventListener('click', function () {
            // 创建遮罩并添加到页面
            var overlay = document.createElement('div');
            overlay.className = 'overlay';
            var cloneImg = img.cloneNode(true);

            // 获取图片的原始尺寸
            var imgWidth = img.naturalWidth;
            var imgHeight = img.naturalHeight;

            // 计算缩放比例
            var scaleWidth = window.innerWidth * 0.8 / imgWidth;
            var scaleHeight = window.innerHeight * 0.8 / imgHeight;
            var scale = Math.min(scaleWidth, scaleHeight);

            // 设置图片的缩放尺寸
            cloneImg.style.width = (imgWidth * scale) + "px";
            cloneImg.style.height = (imgHeight * scale) + "px";

            overlay.appendChild(cloneImg);
            document.body.appendChild(overlay);

            // 显示遮罩
            overlay.style.display = 'flex';

            // 当用户点击放大的图片或遮罩时
            overlay.addEventListener('click', function () {
                document.body.removeChild(overlay);
            });
        });
    });
});
