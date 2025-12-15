let currentBlobId = null;

$(document).ready(function() {

  // 4.1.a Required field validation
  function validateRequired(value) {
    return value.trim() !== '';
  }

  // 4.1.b Positive integer validation
  function validatePositiveInteger(value) {
    const num = Number(value);
    return !isNaN(num) && Number.isInteger(num) && num > 0;
  }

  $('#data-form').on('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const nameValue = $('#name').val();
    const ageValue = $('#age').val();

    $('.error-message').text('');

    // Validate name (required)
    if (!validateRequired(nameValue)) {
      $('#name-error').text('Name is required');
      isValid = false;
    }

    // Validate age (positive integer)
    if (!validatePositiveInteger(ageValue)) {
      $('#age-error').text('Age must be a positive integer');
      isValid = false;
    }

    if (isValid) {
      const email = $('#email').val() || 'N/A';
      const timestamp = new Date().toLocaleString();
      
      if ($('#data-table tbody tr').length === 1 && 
          $('#data-table tbody td[colspan]').length === 1) {
        $('#data-table tbody').empty();
      }

      const newRow = `
        <tr>
          <td>${nameValue}</td>
          <td>${ageValue}</td>
          <td>${email}</td>
          <td>${timestamp}</td>
        </tr>
      `;
      $('#data-table tbody').append(newRow);

      $('#data-form')[0].reset();
      $('#extra-options').hide();
      $('#show-extra').prop('checked', false);

      alert('Data submitted successfully!');
    }
  });

  
  // 4.2 Show/Hide elements using display
  $('#show-extra').on('change', function() {
    if ($(this).is(':checked')) {
      $('#extra-options').css('display', 'block');
    } else {
      $('#extra-options').css('display', 'none');
    }
  });


  // 4.3.a Change text content
$('#change-text').on('click', function() {
  const currentText = $('#demo-text').text();
  if (currentText === 'This is the original text.') {
    $('#demo-text').text('Changed text');
  } else {
    $('#demo-text').text('This is the original text.');
  }
});

  // 4.3.b Change style
  $('#change-style').on('click', function() {
    const currentColor = $('#styled-text').css('color');
    if (currentColor === 'rgb(231, 76, 60)') {
      $('#styled-text').css({
        'color': '',
        'font-size': '',
        'font-weight': '',
        'background-color': ''
      });
    } else {
      $('#styled-text').css({
        'color': '#e74c3c',
        'font-size': '24px',
        'font-weight': 'bold',
        'background-color': '#fff3cd'
      });
    }
  });

  // 4.3.c Remove element
  $('#remove-paragraph').on('click', function() {
    const indexToRemove = $('#remove-index').val();
    $(`#paragraphs p[data-index="${indexToRemove}"]`).remove();
  });

  // 4.3.d Add new element
  $('#add-paragraph').on('click', function() {
    const newText = $('#new-text').val();
    if (newText.trim() !== '') {
      const currentMax = Math.max(
        ...$('#paragraphs p').map(function() {
          return parseInt($(this).attr('data-index')) || 0;
        }).get(),
        0
      );
      const newIndex = currentMax + 1;
      const newParagraph = `<p data-index="${newIndex}">${newText}</p>`;
      $('#paragraphs').append(newParagraph);
      $('#new-text').val('');
    } else {
      alert('Please enter text for the new paragraph');
    }
  });


  // 4.4.a JSON serialization, POST to jsonblob.com
  $('#save-to-api').on('click', function() {
    const formData = {
      name: $('#name').val(),
      age: $('#age').val(),
      email: $('#email').val() || '',
      timestamp: new Date().toISOString()
    };

    // Validate name (required)
    if (!validateRequired(formData.name)) {
      alert('Name is required to save to API');
      return;
    }
    // Validate age (positive integer)
    if (!validatePositiveInteger(formData.age)) {
      alert('Age must be a positive integer to save to API');
      return;
    }

    $('#api-status').text('Saving to API...').css('color', '#3498db');

    fetch('https://api.jsonblob.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blobId = response.headers.get('X-jsonblob') || response.headers.get('Location');
      if (blobId) {
        currentBlobId = blobId.split('/').pop();
        $('#api-status')
          .text(`Data saved successfully! Blob ID: ${currentBlobId}`)
          .css('color', '#27ae60');
        
        $('#data-form')[0].reset();
        $('#extra-options').hide();
        $('#show-extra').prop('checked', false);
      } else {
        throw new Error('No blob ID received');
      }
    })
    .catch(error => {
      $('#api-status')
        .text(`Error saving data: ${error.message}`)
        .css('color', '#e74c3c');
    });
  });

  // 4.4.b GET from jsonblob.com
  $('#load-from-api').on('click', function() {
    if (!currentBlobId) {
      alert('No data saved yet. Please save data first using "Save to API" button.');
      return;
    }
    $('#api-status').text('Loading from API...').css('color', '#3498db');

    fetch(`https://api.jsonblob.com/${currentBlobId}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      $('#data-table tbody').empty();

      const row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.age}</td>
          <td>${data.email || 'N/A'}</td>
          <td>${new Date(data.timestamp).toLocaleString()}</td>
        </tr>
      `;
      $('#data-table tbody').append(row);

      $('#api-status')
        .text('Data loaded successfully from API!')
        .css('color', '#27ae60');
    })
    .catch(error => {
      $('#api-status')
        .text(`Error loading data: ${error.message}`)
        .css('color', '#e74c3c');
    });
  });
});
