document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');
    const contactForm = document.getElementById('contact-form');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                navLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    dropdowns.forEach(function(dropdown) {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (window.innerWidth <= 768 && dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
        
        if (dropdownMenu) {
            const dropdownItems = dropdownMenu.querySelectorAll('a');
            dropdownItems.forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const href = this.getAttribute('href');
                    if (href) {
                        const targetId = href.substring(1);
                        const targetSection = document.getElementById(targetId);
                        
                        if (targetSection) {
                            const offsetTop = targetSection.offsetTop - 70;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                        
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                });
            });
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const interestCheckboxes = contactForm.querySelectorAll('input[name="interest[]"]:checked');
            
            if (interestCheckboxes.length === 0) {
                showMessage('Please select at least one area of interest.', 'error');
                return;
            }
            
            const btnText = contactForm.querySelector('.btn-text');
            const btnLoading = contactForm.querySelector('.btn-loading');
            const submitBtn = contactForm.querySelector('.btn-submit');
            
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
            if (submitBtn) submitBtn.disabled = true;
            
            fetch('contact-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if (!response.ok) {
                    return response.json().then(function(data) {
                        throw new Error(data.message || 'Server error occurred');
                    });
                }
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    showMessage(data.message, 'success');
                    contactForm.reset();
                } else {
                    showMessage(data.message, 'error');
                }
                
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            })
            .catch(function(error) {
                showMessage(error.message || 'An error occurred. Please try again or contact us directly at info@bioseen.com', 'error');
                
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }
    
    function showMessage(message, type) {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = 'form-message ' + type;
            messageDiv.style.display = 'block';
            
            setTimeout(function() {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .solution-item, .genomics-card, .instrument-feature, .consumables-box').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Handle catalog download - force download for iframe environments
    const catalogBtns = document.querySelectorAll('a[download="BioSeen_Corporate_Profile.pdf"]');
    catalogBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const pdfUrl = this.getAttribute('href');
            
            fetch(pdfUrl)
                .then(function(response) {
                    if (!response.ok) throw new Error('Download failed');
                    return response.blob();
                })
                .then(function(blob) {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'BioSeen_Corporate_Profile.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(function(error) {
                    console.error('Download error:', error);
                    window.open(pdfUrl, '_blank');
                });
            
            return false;
        });
    });
});
