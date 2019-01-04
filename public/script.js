const baseUrl = 'http://localhost:3000';

function previewFile() {
  const file = $('#fileInput').prop('files')[0];
  const reader = new FileReader();
  $('#paleoImg').append(
    '<img id="paleoPic" width="300" alt="Image preview...">'
  );
  // convert it to the 64 base image
  let encodedImg;
  reader.addEventListener(
    'load',
    async () => {
      $('#paleoPic').attr('src', reader.result);

      encodedImg = reader.result.split(',')[1];
      $('#submit').on('click', getRelations.bind(null, encodedImg));
    },
    false
  );
  if (file) {
    // if file exists, execute callback
    reader.readAsDataURL(file);
  }
}

// function to retrieve info from API
async function getRelations(encodedImg) {
  console.log(`Sending stuff to ${baseUrl} via AJAX:`);
  console.log(encodedImg);

  const url = `${baseUrl}/paleo`;
  const method = 'POST';
  console.log(`API METHOD: ${method}`);
  console.log(`API URL: ${url}`);
  const data = {
    encodedpic: encodedImg
  };
  const apiResponse = await $.ajax({
    url,
    method,
    data,
    error: () => {
      console.log('Error sending base64 image to API!');
    }
  });
  console.log(apiResponse.paleoList);
  $('#table').append(createTable(apiResponse.paleoList));
}

// insert the result to a table
/* Ingrents IsPaleo? */
function createTable(paleoArr) {
  let table =
    '<table class="table table-hover"> <thead><tr><th scope="col">Ingredients</th><th scope="col"> Is Paleo</th></tr></thead> <tbody>';
  paleoArr.forEach(element => {
    let k = Object.keys(element)[0];
    let v = Object.values(element)[0];
    let newRow;
    if (v === 'Is not Paleo') {
      newRow = `<tr class="table-danger"><td scope="row">${k}</td><td>${v}</td>`;
    } else if (v === 'Is Paleo') {
      newRow = `<tr class="table-success"><td scope="row">${k}</td><td>${v}</td>`;
    } else {
      newRow = `<tr><td scope="row">${k}</td><td>${v}</td>`;
    }
    table += newRow;
  });
  table += '</tbody></table>';
  console.log('table has been created');
  return table;
}

$('.custom-file').on('change', '#fileInput', previewFile);

$('#removePic').on('click', () => {
  console.log('testing clean');
  $('#paleoImg').empty();
  $('ul').empty();
});
