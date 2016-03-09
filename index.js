PDFJS.workerSrc = './pdf.worker.js';
PDFJS.getDocument('example.pdf').then(pdf => {
  pdf.getPage(1).then(page => {
    let canvas = document.getElementById('canvas');
    let container = document.getElementById('container');
    let canvasContext = canvas.getContext('2d');
    let viewport = page.getViewport(1);

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    container.style.width = viewport.width + 'px';
    container.style.height = viewport.height + 'px';

    page.render({
      canvasContext,
      viewport
    });

    page.getTextContent().then(textContent => {
      PDFJS.renderTextLayer({
        textContent,
        container,
        viewport,
        textDivs: []
      });
    });
  });
});
