let pdfDocument;
let PAGE_HEIGHT;
const DEFAULT_SCALE = 1.33;

PDFJS.workerSrc = './pdf.worker.js';
PDFJS.getDocument('example.pdf').then(pdf => {
  pdfDocument = pdf;

  let viewer = document.getElementById('viewer');
  for (let i=0; i<pdf.pdfInfo.numPages; i++) {
    let page = createEmptyPage(i+1);
    viewer.appendChild(page);
  }

  loadPage(1).then(pdfPage => {
    let viewport = pdfPage.getViewport(DEFAULT_SCALE);
    PAGE_HEIGHT = viewport.height;
    document.body.style.width = `${viewport.width}px`;
  });
});

window.addEventListener('scroll', handleWindowScroll);

function createEmptyPage(num) {
  let page = document.createElement('div');
  let canvas = document.createElement('canvas');
  let wrapper = document.createElement('div');
  let textLayer = document.createElement('div');

  page.className = 'page';
  wrapper.className = 'canvasWrapper';
  textLayer.className = 'textLayer';

  page.setAttribute('id', `pageContainer${num}`);
  page.setAttribute('data-loaded', 'false');
  page.setAttribute('data-page-number', num);

  canvas.setAttribute('id', `page${num}`);

  page.appendChild(wrapper);
  page.appendChild(textLayer);
  wrapper.appendChild(canvas);

  return page;
}

function loadPage(pageNum) {
  return pdfDocument.getPage(pageNum).then(pdfPage => {
    let page = document.getElementById(`pageContainer${pageNum}`);
    let canvas = page.querySelector('canvas');
    let wrapper = page.querySelector('.canvasWrapper');
    let container = page.querySelector('.textLayer');
    let canvasContext = canvas.getContext('2d');
    let viewport = pdfPage.getViewport(DEFAULT_SCALE);

    canvas.width = viewport.width * 2;
    canvas.height = viewport.height * 2;
    page.style.width = `${viewport.width}px`;
    page.style.height = `${viewport.height}px`;
    wrapper.style.width = `${viewport.width}px`;
    wrapper.style.height = `${viewport.height}px`;
    container.style.width = `${viewport.width}px`;
    container.style.height = `${viewport.height}px`;

    pdfPage.render({
      canvasContext,
      viewport
    });

    pdfPage.getTextContent().then(textContent => {
      PDFJS.renderTextLayer({
        textContent,
        container,
        viewport,
        textDivs: []
      });
    });

    page.setAttribute('data-loaded', 'true');

    return pdfPage;
  });
}

function handleWindowScroll() {
  let visiblePageNum = Math.round(window.scrollY / PAGE_HEIGHT) + 1;
  let visiblePage = document.querySelector(`.page[data-page-number="${visiblePageNum}"][data-loaded="false"]`);
  if (visiblePage) {
    setTimeout(function () {
      loadPage(visiblePageNum);
    });
  }
}
