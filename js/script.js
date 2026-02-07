/**
 * Helping Hand to Poor - Main JavaScript
 * Handles: Mobile menu toggle, Form validation, Donate modal
 */

document.addEventListener('DOMContentLoaded', function () {
  initAOS();
  initMobileMenu();
  initDonateModal();
  initForms();
  initFileUpload();
});

/**
 * Initialize AOS (Animate On Scroll) - Framer Motion-style animations
 */
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

/**
 * Mobile hamburger menu toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    const isExpanded = links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isExpanded);
    toggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close menu when clicking a link (for mobile)
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        links.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768 && !toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

/**
 * Donate modal - open/close and form
 */
function initDonateModal() {
  const modal = document.getElementById('donateModal');
  const modalClose = document.getElementById('modalClose');
  const donateForm = document.getElementById('donateForm');
  const donateAmount = document.getElementById('donateAmount');
  const modalCaseName = document.getElementById('modalCaseName');

  if (!modal) return;

  // Open modal when clicking Donate buttons
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
      donateAmount?.focus();
    });
  });

  // Close modal
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

  // Donate form submit
  if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const amount = donateAmount?.value;
      if (!amount || parseInt(amount) < 100) {
        showFieldError(donateAmount, 'Minimum donation is ₹100');
        return;
      }
      // Simulate success - in production, send to backend
      alert('Thank you for your donation! In production, you would be redirected to payment.');
      closeModal();
      donateForm.reset();
    });
  }
}

/**
 * Form validation helpers
 */
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
  return value && value.trim().length > 0;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Initialize all forms with validation
 */
function initForms() {
  // Submit Request Form
  const submitForm = document.getElementById('submitRequestForm');
  if (submitForm) {
    submitForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateSubmitRequestForm(submitForm)) {
        setButtonLoading(document.getElementById('submitBtn'), true);
        // Simulate submission
        setTimeout(function () {
          setButtonLoading(document.getElementById('submitBtn'), false);
          alert('Request submitted successfully! Our team will verify and contact you within 3-5 business days.');
          submitForm.reset();
          document.getElementById('filePreview').innerHTML = '';
          document.getElementById('filePreview').classList.remove('active');
        }, 1500);
      }
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateLoginForm(loginForm)) {
        setButtonLoading(document.getElementById('loginBtn'), true);
        setTimeout(function () {
          setButtonLoading(document.getElementById('loginBtn'), false);
          alert('Login successful! (Demo - no backend)');
        }, 1000);
      }
    });
  }

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateRegisterForm(registerForm)) {
        setButtonLoading(document.getElementById('registerBtn'), true);
        setTimeout(function () {
          setButtonLoading(document.getElementById('registerBtn'), false);
          alert('Registration successful! You can now login.');
          window.location.href = 'login.html';
        }, 1000);
      }
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContactForm(contactForm)) {
        setButtonLoading(document.getElementById('contactSubmitBtn'), true);
        setTimeout(function () {
          setButtonLoading(document.getElementById('contactSubmitBtn'), false);
          alert('Message sent! We will get back to you soon.');
          contactForm.reset();
        }, 1000);
      }
    });
  }

  // Filter Form (Browse Cases)
  const filterForm = document.getElementById('filterForm');
  if (filterForm) {
    filterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // In production, would filter cases via API
      alert('Filters applied. (Demo - would filter cases)');
    });
  }

  // Clear errors on input
  document.querySelectorAll('.form-control').forEach(function (input) {
    input.addEventListener('input', function () {
      clearFieldError(input);
    });
  });
}

/**
 * Validate Submit Request Form
 */
function validateSubmitRequestForm(form) {
  let isValid = true;
  const fields = [
    { id: 'fullName', validate: validateRequired, message: 'Full name is required' },
    { id: 'age', validate: (v) => v && parseInt(v) >= 1 && parseInt(v) <= 120, message: 'Enter valid age (1-120)' },
    { id: 'city', validate: validateRequired, message: 'City is required' },
    { id: 'category', validate: validateRequired, message: 'Please select a category' },
    { id: 'problemDesc', validate: (v) => v && v.trim().length >= 20, message: 'Please describe your situation (min 20 characters)' },
    { id: 'amountNeeded', validate: (v) => v && parseInt(v) >= 1, message: 'Enter valid amount' },
    { id: 'contactInfo', validate: validateRequired, message: 'Contact information is required' }
  ];

  fields.forEach(function (field) {
    const input = form.querySelector('[name="' + field.id + '"]') || document.getElementById(field.id);
    if (!input) return;
    const value = input.value;
    if (!field.validate(value)) {
      showFieldError(input, field.message);
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  // File upload validation
  const fileInput = document.getElementById('proofDocuments');
  if (fileInput && !fileInput.files.length) {
    const fileUpload = document.getElementById('fileUpload');
    const errorEl = document.getElementById('proofDocumentsError');
    if (errorEl) errorEl.textContent = 'Please upload at least one proof document';
    if (fileUpload) fileUpload.style.borderColor = '#dc2626';
    isValid = false;
  } else if (fileInput && fileInput.files.length) {
    const errorEl = document.getElementById('proofDocumentsError');
    if (errorEl) errorEl.textContent = '';
    const fileUpload = document.getElementById('fileUpload');
    if (fileUpload) fileUpload.style.borderColor = '';
  }

  return isValid;
}

/**
 * Validate Login Form
 */
function validateLoginForm(form) {
  let isValid = true;
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  if (!validateEmail(email?.value)) {
    showFieldError(email, 'Enter valid email');
    isValid = false;
  } else clearFieldError(email);

  if (!validateRequired(password?.value)) {
    showFieldError(password, 'Password is required');
    isValid = false;
  } else clearFieldError(password);

  return isValid;
}

/**
 * Validate Register Form
 */
function validateRegisterForm(form) {
  let isValid = true;
  const fullName = document.getElementById('regFullName');
  const email = document.getElementById('regEmail');
  const password = document.getElementById('regPassword');
  const confirmPassword = document.getElementById('regConfirmPassword');
  const userType = form.querySelector('input[name="userType"]:checked');
  const terms = document.getElementById('termsCheckbox');

  if (!validateRequired(fullName?.value)) {
    showFieldError(fullName, 'Full name is required');
    isValid = false;
  } else clearFieldError(fullName);

  if (!validateEmail(email?.value)) {
    showFieldError(email, 'Enter valid email');
    isValid = false;
  } else clearFieldError(email);

  if (!password?.value || password.value.length < 6) {
    showFieldError(password, 'Password must be at least 6 characters');
    isValid = false;
  } else clearFieldError(password);

  if (password?.value !== confirmPassword?.value) {
    showFieldError(confirmPassword, 'Passwords do not match');
    isValid = false;
  } else clearFieldError(confirmPassword);

  if (!userType) {
    const errorEl = document.getElementById('userTypeError');
    if (errorEl) errorEl.textContent = 'Please select user type';
    isValid = false;
  } else {
    const errorEl = document.getElementById('userTypeError');
    if (errorEl) errorEl.textContent = '';
  }

  if (!terms?.checked) {
    const errorEl = document.getElementById('termsError');
    if (errorEl) errorEl.textContent = 'You must agree to the terms';
    isValid = false;
  } else {
    const errorEl = document.getElementById('termsError');
    if (errorEl) errorEl.textContent = '';
  }

  return isValid;
}

/**
 * Validate Contact Form
 */
function validateContactForm(form) {
  let isValid = true;
  const fields = [
    { id: 'contactName', validate: validateRequired, message: 'Name is required' },
    { id: 'contactEmail', validate: validateEmail, message: 'Enter valid email' },
    { id: 'contactSubject', validate: validateRequired, message: 'Subject is required' },
    { id: 'contactMessage', validate: (v) => v && v.trim().length >= 10, message: 'Message must be at least 10 characters' }
  ];

  fields.forEach(function (field) {
    const input = document.getElementById(field.id);
    if (!input) return;
    const value = input.value;
    if (!field.validate(value)) {
      showFieldError(input, field.message);
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

/**
 * File upload with preview
 */
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
    if (files.length === 0) {
      preview.classList.remove('active');
      return;
    }
    preview.classList.add('active');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = file.name;
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      } else {
        const p = document.createElement('p');
        p.textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
        p.style.fontSize = '0.875rem';
        p.style.marginTop = '0.5rem';
        preview.appendChild(p);
      }
    }
  });
}

/**
 * Button loading state
 */
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
