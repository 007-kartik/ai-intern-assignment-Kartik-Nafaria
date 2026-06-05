/**
 * EduSphere Global Lead Capture Form Validation and Handling
 * Author: Kartik Nafaria (AI Automation Intern Candidate)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('leadForm');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const countryInput = document.getElementById('country');
  const universityInput = document.getElementById('university');
  const messageInput = document.getElementById('message');
  const courseLevelRadios = document.querySelectorAll('input[name="courseLevel"]');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const toastContainer = document.getElementById('toastContainer');

  // --- Constants ---
  const MAX_CHARACTERS = 300;
  const MIN_NAME_LENGTH = 3;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // --- Initialize Event Listeners ---
  setupValidationListeners();
  setupCharacterCounter();
  
  // Form submission intercept
  form.addEventListener('submit', handleFormSubmit);

  /**
   * Sets up real-time inputs validation on blur and on-input change
   */
  function setupValidationListeners() {
    // Name validation
    nameInput.addEventListener('blur', () => validateName(true));
    nameInput.addEventListener('input', () => validateName(false));

    // Email validation
    emailInput.addEventListener('blur', () => validateEmail(true));
    emailInput.addEventListener('input', () => validateEmail(false));

    // Country validation
    countryInput.addEventListener('blur', () => validateCountry(true));
    countryInput.addEventListener('change', () => validateCountry(false));

    // University validation
    universityInput.addEventListener('blur', () => validateUniversity(true));
    universityInput.addEventListener('input', () => validateUniversity(false));

    // Message validation
    messageInput.addEventListener('blur', () => validateMessage(true));
    messageInput.addEventListener('input', () => validateMessage(false));

    // Course Level (Radio group) validation
    courseLevelRadios.forEach(radio => {
      radio.addEventListener('change', () => validateCourseLevel());
    });
  }

  /**
   * Character Counter for Message Textarea
   */
  function setupCharacterCounter() {
    messageInput.addEventListener('input', () => {
      const remaining = messageInput.value.length;
      charCounter.textContent = `${remaining} / ${MAX_CHARACTERS}`;
      
      if (remaining >= MAX_CHARACTERS) {
        charCounter.classList.add('limit-reached');
      } else {
        charCounter.classList.remove('limit-reached');
      }
    });
  }

  /* ==========================================================================
     VALIDATION LOGIC
     ========================================================================== */

  /**
   * Helper to set input state classes
   */
  function setFieldState(element, groupID, isValid, errorMsgId) {
    const group = document.getElementById(groupID);
    if (!group) return;

    if (isValid) {
      group.classList.remove('is-invalid');
      group.classList.add('is-valid');
    } else {
      group.classList.remove('is-valid');
      group.classList.add('is-invalid');
    }
  }

  function validateName(showError) {
    const value = nameInput.value.trim();
    const isValid = value.length >= MIN_NAME_LENGTH;
    if (showError || isValid) {
      setFieldState(nameInput, 'group-name', isValid);
    }
    return isValid;
  }

  function validateEmail(showError) {
    const value = emailInput.value.trim();
    const isValid = EMAIL_REGEX.test(value);
    if (showError || isValid) {
      setFieldState(emailInput, 'group-email', isValid);
    }
    return isValid;
  }

  function validateCountry(showError) {
    const value = countryInput.value;
    const isValid = value !== "";
    if (showError || isValid) {
      setFieldState(countryInput, 'group-country', isValid);
    }
    return isValid;
  }

  function validateUniversity(showError) {
    const value = universityInput.value.trim();
    const isValid = value.length > 0;
    if (showError || isValid) {
      setFieldState(universityInput, 'group-university', isValid);
    }
    return isValid;
  }

  function validateMessage(showError) {
    const value = messageInput.value.trim();
    const isValid = value.length > 0 && value.length <= MAX_CHARACTERS;
    if (showError || isValid) {
      setFieldState(messageInput, 'group-message', isValid);
    }
    return isValid;
  }

  function validateCourseLevel() {
    let checked = false;
    courseLevelRadios.forEach(radio => {
      if (radio.checked) checked = true;
    });

    const group = document.getElementById('group-courseLevel');
    if (checked) {
      group.classList.remove('is-invalid');
      group.classList.add('is-valid');
    } else {
      group.classList.remove('is-valid');
      group.classList.add('is-invalid');
    }
    return checked;
  }

  /**
   * Validates all form elements at once (e.g. before submitting)
   */
  function validateAll() {
    const isNameValid = validateName(true);
    const isEmailValid = validateEmail(true);
    const isCountryValid = validateCountry(true);
    const isUniversityValid = validateUniversity(true);
    const isMessageValid = validateMessage(true);
    const isCourseValid = validateCourseLevel();

    return isNameValid && isEmailValid && isCountryValid && isUniversityValid && isMessageValid && isCourseValid;
  }

  /* ==========================================================================
     SUBMIT AND NOTIFICATION SYSTEM
     ========================================================================== */

  /**
   * Handle Lead Form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Trigger validation alerts
    const isFormValid = validateAll();

    if (!isFormValid) {
      showToast('Validation Error', 'Please correct the highlighted fields and try again.', 'error');
      return;
    }

    // Capture Form Data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      country: countryInput.value,
      courseLevel: document.querySelector('input[name="courseLevel"]:checked').value,
      university: universityInput.value.trim(),
      message: messageInput.value.trim(),
      submittedAt: new Date().toISOString()
    };

    // Trigger Submit Loading State
    setLoadingState(true);

    // Simulate Network Request / Database persistence
    setTimeout(() => {
      // Success Response Handler
      setLoadingState(false);
      
      // Print formatted JSON in console as required
      console.group('%c EduSphere Lead Capture Success ', 'background: #6366F1; color: white; padding: 4px; border-radius: 4px;');
      console.log('Submitted Payload:', JSON.stringify(formData, null, 2));
      console.groupEnd();

      // Show toast notification
      showToast(
        'Lead Captured Successfully!', 
        `Thank you ${formData.name}. Your details have been submitted. Check the console for JSON.`, 
        'success'
      );

      // Reset form fields and validation styles
      resetForm();
    }, 1500);
  }

  /**
   * Toggle button loading state
   */
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.classList.add('is-loading');
    } else {
      submitBtn.classList.remove('is-loading');
    }
  }

  /**
   * Clears form inputs and visual validation styles
   */
  function resetForm() {
    form.reset();
    charCounter.textContent = `0 / ${MAX_CHARACTERS}`;
    charCounter.classList.remove('limit-reached');

    // Remove green/red borders
    const groups = document.querySelectorAll('.form-group');
    groups.forEach(group => {
      group.classList.remove('is-valid', 'is-invalid');
    });
  }

  /**
   * Display Custom Toast Notifications
   */
  function showToast(title, desc, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Select suitable icons
    let iconClass = 'fa-circle-check';
    if (type === 'error') {
      iconClass = 'fa-triangle-exclamation';
    } else if (type === 'info') {
      iconClass = 'fa-circle-info';
    }

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${desc}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Trigger removal transitions
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        toast.remove();
      }, 300); // match CSS transition speed
    }, 4000);
  }
});
