$(function() {
    $('#main-canvas').clipImage();
});

(function($) {
    function ClipImage(options) {
        this.options = $.extend(
            {
                clipBtnSelector: '#getImage', // clip button selector
                canvasWidth: 600, // canvas width
                canvasHeight: 400, // canvas height
                imgUrl: 'https://i.imgur.com/eVti7ig.jpg', // should have Access-Control-Allow-Origin:* to be downloaded
                filterStrength: 5, // blur filter strength
                radius: 80, // clipmask radius
            },
            options
        );

        this.init();
    }

    ClipImage.prototype = {
        init: function() {
            var self = this;

            if (self.options.canvas) {
                self.getOptions();

                self.canvas[0].width = this.options.canvasWidth;
                self.canvas[0].height = this.options.canvasHeight;

                self.img = self.loadImage(self.imgUrl, function() {
                    var tempCanvas = self.createTempCanvas(
                        self.img.width,
                        self.img.height
                    );

                    tempCanvas.ctx.filter =
                        'blur(' + self.filterStrength + 'px)';
                    tempCanvas.ctx.drawImage(self.img, 0, 0);

                    self.bluredImg = self.loadImage(
                        tempCanvas.canvas.toDataURL('image/png'),
                        self.atachEvents.bind(self)
                    );
                });
            }
        },

        getOptions: function() {
            this.canvas = $(this.options.canvas);
            this.ctx = this.canvas[0].getContext('2d');
            this.btn = $(this.options.clipBtnSelector);
            this.radius = this.options.radius;
            this.imgUrl = this.options.imgUrl;
            this.filterStrength = this.options.filterStrength;

            this.isDown = false;
            this.startX = 0;
            this.startY = 0;
            this.clippingMaskX = this.options.canvasWidth / 2;
            this.clippingMaskY = this.options.canvasHeight / 2;
            this.bluredImg;
            this.img;
        },

        loadImage: function(url, cb) {
            var img = new Image(),
                $img = $(img);

            $img.attr({
                crossOrigin: 'anonymous',
                src: url,
            });

            if (typeof cb === 'function') {
                $img.on('load', cb);
            }

            return img;
        },

        atachEvents: function() {
            var self = this;

            self.canvas
                .on('mousedown', function(e) {
                    self.handleMouseDown(e);
                })
                .on('mousemove', function(e) {
                    self.handleMouseMove(e);
                })
                .on('mouseup', function(e) {
                    self.handleMouseUpOut(e);
                })
                .on('mouseout', function(e) {
                    self.handleMouseUpOut(e);
                });

            self.btn.on('click', function(e) {
                e.preventDefault();

                self.clipImage(
                    self.img,
                    self.clippingMaskX,
                    self.clippingMaskY,
                    self.radius
                );
            });

            self.draw();
        },

        draw: function() {
            this.ctx.clearRect(
                0,
                0,
                this.canvas[0].width,
                this.canvas[0].height
            );

            this.clippedViewport();
        },

        clippedViewport: function() {
            this.ctx.save();

            this.ctx.drawImage(this.img, 0, 0);

            this.ctx.globalCompositeOperation = 'destination-atop';

            this.createCircle(
                this.ctx,
                this.clippingMaskX,
                this.clippingMaskY,
                this.radius
            );

            this.ctx.fill();

            this.ctx.drawImage(this.bluredImg, 0, 0);

            this.ctx.restore();
        },

        createCircle: function(ctx, x, y, r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
        },

        clipImage: function(image, clipX, clipY, size) {
            var imgSize = size * 2,
                tempCanvas = this.createTempCanvas(imgSize, imgSize);

            this.createCircle(tempCanvas.ctx, size, size, size);

            tempCanvas.ctx.clip();

            tempCanvas.ctx.drawImage(
                image,
                clipX - size,
                clipY - size,
                imgSize,
                imgSize,
                0,
                0,
                imgSize,
                imgSize
            );

            this.downloadFile(tempCanvas.canvas.toDataURL());
        },

        createTempCanvas: function(width, height) {
            var tempCanvas = $('<canvas />'),
                tempCtx = tempCanvas[0].getContext('2d');

            tempCanvas[0].width = width;
            tempCanvas[0].height = height;

            return {
                canvas: tempCanvas[0],
                ctx: tempCtx,
            };
        },

        handleMouseDown: function(e) {
            var offsetX = this.canvas[0].getBoundingClientRect().left,
                offsetY = this.canvas[0].getBoundingClientRect().top;

            this.startX = parseInt(e.clientX - offsetX);
            this.startY = parseInt(e.clientY - offsetY);

            if (
                this.startX > this.clippingMaskX - this.radius &&
                this.startX <= this.clippingMaskX + this.radius &&
                this.startY > this.clippingMaskY - this.radius &&
                this.startY <= this.clippingMaskY + this.radius
            ) {
                this.isDown = true;
            }
        },

        handleMouseUpOut: function(e) {
            this.isDown = false;
        },

        handleMouseMove: function(e) {
            var dx,
                dy,
                mouseX,
                mouseY,
                offsetX = this.canvas[0].getBoundingClientRect().left,
                offsetY = this.canvas[0].getBoundingClientRect().top;

            if (this.isDown) {
                mouseX = parseInt(e.clientX - offsetX);
                mouseY = parseInt(e.clientY - offsetY);
                dx = mouseX - this.startX;
                dy = mouseY - this.startY;
                this.startX = mouseX;
                this.startY = mouseY;

                this.clippingMaskX += dx;
                this.clippingMaskY += dy;

                this.draw();
            }
        },

        downloadFile: function(sUrl) {
            var link = $('<a />'),
                fileName = this.imgUrl.substring(
                    this.imgUrl.lastIndexOf('/') + 1,
                    this.imgUrl.length
                );

            link.attr({
                href: sUrl,
                target: '_blank',
                download: 'cropped-' + fileName,
            });

            link.get(0).click();
        },
    };

    $.fn.clipImage = function(opt) {
        return this.each(function() {
            $(this).data(
                'clipImage',
                new ClipImage($.extend(opt, { canvas: this }))
            );
        });
    };
})(jQuery);
