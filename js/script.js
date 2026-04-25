/**
 * Helping Hand to Poor - Main JavaScript
 * Handles: Mobile menu, forms, donate modal, API integration
 */

const API_BASE_URL = 'http://localhost:5050/api';

document.addEventListener('DOMContentLoaded', function () {
  initAOS();
  initMobileMenu();
  initDonateModal();
  initForms();
  initFileUpload();
  initCasesBrowse();
});

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }
}

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    const isExpanded = links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isExpanded);
    toggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        links.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768 && !toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

function initDonateModal() {
  const modal = document.getElementById('donateModal');
  const modalClose = document.getElementById('modalClose');
  const donateForm = document.getElementById('donateForm');
  const donateAmount = document.getElementById('donateAmount');
  const modalCaseName = document.getElementById('modalCaseName');

  if (!modal) return;

  document.querySelectorAll('.donate-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const caseName = btn.getAttribute('data-case');
      const suggestedAmount = btn.getAttribute('data-amount');
      modalCaseName.textContent = caseName;
      if (donateAmount) {
        donateAmount.value = suggestedAmount || '';
        donateAmount.placeholder = 'Min: 100';
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (donateAmount) donateAmount.focus();
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (donateForm) {
    donateForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const amount = donateAmount ? donateAmount.value : '';
      if (!amount || parseInt(amount, 10) < 100) {
        showFieldError(donateAmount, 'Minimum donation is Rs 100');
        return;
      }

      try {
        const response = await fetch(API_BASE_URL + '/cases/donation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseName: modalCaseName ? modalCaseName.textContent : '',
            amount: parseInt(amount, 10),
            message: (document.getElementById('donateMessage') || {}).value || ''
          })
        });

        if (!response.ok) throw new Error('Donation failed');

        alert('Thank you for your donation!');
        closeModal();
        donateForm.reset();
      } catch (error) {
        alert('Donation service is currently unavailable. Please try again later.');
      }
    });
  }
}

function initForms() {
  const submitForm = document.getElementById('submitRequestForm');
  if (submitForm) {
    submitForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateSubmitRequestForm(submitForm)) return;

      const submitButton = document.getElementById('submitBtn');
      setButtonLoading(submitButton, true);

      try {
        const payload = {
          fullName: getValue('fullName'),
          age: parseInt(getValue('age') || '0', 10),
          city: getValue('city'),
          category: getValue('category'),
          problemDescription: getValue('problemDesc'),
          amountNeeded: parseInt(getValue('amountNeeded') || '0', 10),
          contactInfo: getValue('contactInfo')
        };

        const response = await fetch(API_BASE_URL + '/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Submit failed');

        alert('Request submitted successfully! Our team will verify your case.');
        submitForm.reset();
        document.getElementById('filePreview').innerHTML = '';
        document.getElementById('filePreview').classList.remove('active');
      } catch (error) {
        alert('Request could not be submitted right now. Please try again later.');
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateLoginForm(loginForm)) alert('Login successful!');
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateRegisterForm(registerForm)) {
        alert('Registration successful! You can now login.');
        window.location.href = 'login.html';
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContactForm(contactForm)) {
        alert('Message sent! We will get back to you soon.');
        contactForm.reset();
      }
    });
  }

  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      await loadCases();
    });
  }

  document.querySelectorAll('.form-control').forEach(function (input) {
    input.addEventListener('input', function () {
      clearFieldError(input);
    });
  });
}

function initCasesBrowse() {
  if (!document.getElementById('casesGrid')) return;
  loadCases();
}

async function loadCases() {
  const casesGrid = document.getElementById('casesGrid');
  if (!casesGrid) return;

  const category = getValue('filterCategory');
  const city = getValue('filterCity');
  const query = new URLSearchParams();
  if (category) query.append('category', category);
  if (city) query.append('city', city);

  try {
    const response = await fetch(API_BASE_URL + '/cases?' + query.toString());
    if (!response.ok) throw new Error('Fetch failed');

    const cases = await response.json();
    renderCases(cases);
  } catch (error) {
    casesGrid.innerHTML = '<p>Cases could not be loaded right now.</p>';
  }
}

function renderCases(cases) {
  const casesGrid = document.getElementById('casesGrid');
  if (!casesGrid) return;

  if (!Array.isArray(cases) || cases.length === 0) {
    casesGrid.innerHTML = '<p>No verified cases found for the selected filters.</p>';
    return;
  }

  casesGrid.innerHTML = cases.map(function (item) {
    const imageUrl = item.imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop';
    return (
      '<article class="case-card">' +
      '<div class="case-card__image-wrap"><img src="' + imageUrl + '" alt="' + escapeHtml(item.fullName) + '" class="case-card__image" width="400" height="250" loading="lazy"></div>' +
      '<div class="case-card__content">' +
      '<span class="case-card__category">' + escapeHtml(item.category) + '</span>' +
      '<h3 class="case-card__name">' + escapeHtml(item.fullName) + '</h3>' +
      '<p class="case-card__meta">' + Number(item.age || 0) + ' years • ' + escapeHtml(item.city) + '</p>' +
      '<p class="case-card__desc">' + escapeHtml(item.problemDescription) + '</p>' +
      '<p class="case-card__amount">Rs ' + Number(item.amountNeeded || 0).toLocaleString() + ' needed</p>' +
      '<button class="btn btn--primary btn--block donate-btn" data-case="' + escapeHtml(item.fullName) + '" data-amount="' + Number(item.amountNeeded || 0) + '">Donate</button>' +
      '</div></article>'
    );
  }).join('');

  initDonateModal();
}

function validateSubmitRequestForm(form) {
  let isValid = true;
  const fields = [
    { id: 'fullName', validate: validateRequired, message: 'Full name is required' },
    { id: 'age', validate: function (v) { return v && parseInt(v, 10) >= 1 && parseInt(v, 10) <= 120; }, message: 'Enter valid age (1-120)' },
    { id: 'city', validate: validateRequired, message: 'City is required' },
    { id: 'category', validate: validateRequired, message: 'Please select a category' },
    { id: 'problemDesc', validate: function (v) { return v && v.trim().length >= 20; }, message: 'Please describe your situation (min 20 characters)' },
    { id: 'amountNeeded', validate: function (v) { return v && parseInt(v, 10) >= 1; }, message: 'Enter valid amount' },
    { id: 'contactInfo', validate: validateRequired, message: 'Contact information is required' }
  ];

  fields.forEach(function (field) {
    const input = form.querySelector('[name="' + field.id + '"]') || document.getElementById(field.id);
    if (!input) return;
    if (!field.validate(input.value)) {
      showFieldError(input, field.message);
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  const fileInput = document.getElementById('proofDocuments');
  if (fileInput && !fileInput.files.length) {
    const errorEl = document.getElementById('proofDocumentsError');
    if (errorEl) errorEl.textContent = 'Please upload at least one proof document';
    isValid = false;
  }

  return isValid;
}

function validateLoginForm() {
  let isValid = true;
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  if (!validateEmail(email && email.value)) {
    showFieldError(email, 'Enter valid email');
    isValid = false;
  } else clearFieldError(email);

  if (!validateRequired(password && password.value)) {
    showFieldError(password, 'Password is required');
    isValid = false;
  } else clearFieldError(password);

  return isValid;
}

function validateRegisterForm(form) {
  let isValid = true;
  const fullName = document.getElementById('regFullName');
  const email = document.getElementById('regEmail');
  const password = document.getElementById('regPassword');
  const confirmPassword = document.getElementById('regConfirmPassword');
  const userType = form.querySelector('input[name="userType"]:checked');
  const terms = document.getElementById('termsCheckbox');

  if (!validateRequired(fullName && fullName.value)) {
    showFieldError(fullName, 'Full name is required');
    isValid = false;
  } else clearFieldError(fullName);

  if (!validateEmail(email && email.value)) {
    showFieldError(email, 'Enter valid email');
    isValid = false;
  } else clearFieldError(email);

  if (!(password && password.value) || password.value.length < 6) {
    showFieldError(password, 'Password must be at least 6 characters');
    isValid = false;
  } else clearFieldError(password);

  if ((password && password.value) !== (confirmPassword && confirmPassword.value)) {
    showFieldError(confirmPassword, 'Passwords do not match');
    isValid = false;
  } else clearFieldError(confirmPassword);

  if (!userType) {
    const userTypeError = document.getElementById('userTypeError');
    if (userTypeError) userTypeError.textContent = 'Please select user type';
    isValid = false;
  }

  if (!(terms && terms.checked)) {
    const termsError = document.getElementById('termsError');
    if (termsError) termsError.textContent = 'You must agree to the terms';
    isValid = false;
  }

  return isValid;
}

function validateContactForm() {
  let isValid = true;
  const fields = [
    { id: 'contactName', validate: validateRequired, message: 'Name is required' },
    { id: 'contactEmail', validate: validateEmail, message: 'Enter valid email' },
    { id: 'contactSubject', validate: validateRequired, message: 'Subject is required' },
    { id: 'contactMessage', validate: function (v) { return v && v.trim().length >= 10; }, message: 'Message must be at least 10 characters' }
  ];

  fields.forEach(function (field) {
    const input = document.getElementById(field.id);
    if (!input) return;
    if (!field.validate(input.value)) {
      showFieldError(input, field.message);
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

function initFileUpload() {
  const fileUpload = document.getElementById('fileUpload');
  const fileInput = document.getElementById('proofDocuments');
  const preview = document.getElementById('filePreview');

  if (!fileUpload || !fileInput || !preview) return;

  fileUpload.addEventListener('click', function () {
    fileInput.click();
  });

  fileUpload.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', function () {
    preview.innerHTML = '';
    const files = fileInput.files;
    if (!files.length) {
      preview.classList.remove('active');
      return;
    }

    preview.classList.add('active');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const p = document.createElement('p');
      p.textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
      p.style.fontSize = '0.875rem';
      p.style.marginTop = '0.5rem';
      preview.appendChild(p);
    }
  });
}

function showFieldError(input, message) {
  if (!input) return;
  input.classList.add('error');
  const errorEl = document.getElementById(input.id + 'Error');
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(input) {
  if (!input) return;
  input.classList.remove('error');
  const errorEl = document.getElementById(input.id + 'Error');
  if (errorEl) errorEl.textContent = '';
}

function validateRequired(value) {
  return value && String(value).trim().length > 0;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? String(element.value || '').trim() : '';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
