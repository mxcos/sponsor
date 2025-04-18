// 配置
const CONFIG = {
    qrcodes: {
        wechat: 'assets/images/qrcode/wechat.png',
        alipay: 'assets/images/qrcode/alipay.png'
    }
};

// DOM 元素
const elements = {
    qrcodeModal: document.getElementById('qrcodeModal'),
    qrcodeContent: document.querySelector('.qrcode-content'),
    qrcodeImage: document.getElementById('qrcodeImage'),
    closeQrcode: document.getElementById('closeQrcode'),
    wechatButton: document.getElementById('wechat'),
    alipayButton: document.getElementById('alipay'),
    donationContainer: document.querySelector('.donation-container')
};

// 工具函数
const utils = {
    showModal: (imageSrc) => {
        elements.qrcodeImage.src = imageSrc;
        elements.qrcodeModal.classList.add('show');
        elements.donationContainer.classList.add('blur');
        elements.qrcodeContent.classList.add('show');
        document.body.style.overflow = 'hidden';
    },
    hideModal: () => {
        elements.qrcodeContent.classList.remove('show');
        elements.qrcodeContent.classList.add('hide');
        elements.donationContainer.classList.remove('blur');
        document.body.style.overflow = '';
        setTimeout(() => {
            elements.qrcodeModal.classList.remove('show');
            elements.qrcodeContent.classList.remove('hide');
        }, 600);
    },
    setQrcodeImage: (src) => {
        const img = new Image();
        img.onload = () => {
            elements.qrcodeImage.src = src;
            // 确保图片大小一致
            elements.qrcodeImage.style.width = '240px';
            elements.qrcodeImage.style.height = '240px';
            elements.qrcodeImage.style.objectFit = 'contain';
        };
        img.src = src;
    }
};

// 事件处理
const eventHandlers = {
    showQrcode: (type) => {
        utils.setQrcodeImage(CONFIG.qrcodes[type]);
        utils.showModal(CONFIG.qrcodes[type]);
    },
    hideQrcode: () => {
        utils.hideModal();
    }
};

// 初始化
const init = () => {
    // 绑定事件
    elements.wechatButton.addEventListener('click', () => eventHandlers.showQrcode('wechat'));
    elements.alipayButton.addEventListener('click', () => eventHandlers.showQrcode('alipay'));
    elements.closeQrcode.addEventListener('click', eventHandlers.hideQrcode);
    elements.qrcodeModal.addEventListener('click', (e) => {
        if (e.target === elements.qrcodeModal) {
            eventHandlers.hideQrcode();
        }
    });
};

// 启动应用
document.addEventListener('DOMContentLoaded', init); 