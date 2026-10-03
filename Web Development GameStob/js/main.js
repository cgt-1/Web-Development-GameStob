/*
   js buat logic event listener, pas purchase form, search, dll
*/

document.addEventListener('DOMContentLoaded', function(){

  /*
    PAGE NAVIGATION
  */
  function showPage(pageId){
    var pages = document.querySelectorAll('.page');
    pages.forEach(function (page){
      page.style.display = 'none';
    });
    var target = document.getElementById(pageId);
    if(target) {
      target.style.display = 'block';
      window.scrollTo(0, 0);
    }
  }

  document.querySelectorAll('[data-page]').forEach(function (link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      showPage(this.getAttribute('data-page'));
      document.querySelector('nav ul').classList.remove('open');
    });
  });

  showPage('page-home');



  /*
    HAMBURGER MENU bisa buat smaller devices
  */
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('nav ul');

  if(hamburger){
    hamburger.addEventListener('click', function (){
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', function (e){
      if(!hamburger.contains(e.target) && !navMenu.contains(e.target)){
        navMenu.classList.remove('open');
      }
    });
  }


  /*
    CATALOG SEARCH sama FILTER buat gammenya
  */
  var searchInput = document.getElementById('catalogsearch');
  var genreFilter = document.getElementById('cataloggenre');
  var catalogCards = document.querySelectorAll('.catalogcard');
  var emptyMsg = document.getElementById('catalogempty');

  function filterCatalog(){
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var genre = genreFilter ? genreFilter.value.toLowerCase() : '';
    var count = 0;

    catalogCards.forEach(function(card){
      var title = (card.dataset.title || '').toLowerCase();
      var cardGenre = (card.dataset.genre || '').toLowerCase();
      var platform = (card.dataset.platform || '').toLowerCase();

      var matchSearch = query === '' || title.indexOf(query) !== -1 
      || cardGenre.indexOf(query) !== -1 || platform.indexOf(query) !== -1;
      var matchGenre = genre === '' || genre === 'all' || cardGenre === genre;

      if(matchSearch && matchGenre){
        card.style.display = '';
        count++;
      }else {
        card.style.display = 'none';
      }
    });

    if(emptyMsg) emptyMsg.style.display = count === 0 ? 'block' : 'none';
  }

  if(searchInput) searchInput.addEventListener('input', filterCatalog);
  if(genreFilter) genreFilter.addEventListener('change', filterCatalog);



  /* 
    PURCHASE FORM VALIDATION - ga pake regex
  */
  var form = document.getElementById('purchase-form');

  if (form){

    function setError(fieldId, msgId, message){
      var field = document.getElementById(fieldId);
      var msg = document.getElementById(msgId);
      if(field){ field.classList.add('error'); field.classList.remove('valid');}
      if(msg){ msg.textContent = message; msg.classList.add('show');}
    }

    function setValid(fieldId, msgId){
      var field = document.getElementById(fieldId);
      var msg = document.getElementById(msgId);
      if(field){ field.classList.remove('error'); field.classList.add('valid');}
      if(msg) { msg.classList.remove('show');}
    }

    /*
    cek email bener ato ngga
    kalo gaada @ send error msg Email must contain one "@"
    kalo ngga ada . abis @ send error msg Enter a valid email (e.g. name@mail.com)
    */
    function validateEmail(){
      var val = document.getElementById('email').value.trim();
      if (val === ''){setError('email', 'email-error', 'Email is required.'); return false;}
      var atIndex = val.indexOf('@');
      if(atIndex < 1 || val.indexOf('@', atIndex + 1) !== -1)
        {setError('email', 'email-error', 'Email must contain one "@".'); return false; }
      var afterAt = val.substring(atIndex + 1);
      if(afterAt.indexOf('.') === -1 || afterAt.length < 3)
        {setError('email', 'email-error', 'Enter a valid email (e.g. name@mail.com).'); return false; }
      setValid('email', 'email-error');
      return true;
    }

    /*
    cek no hp harus at least 8 digits
    */
    function validatePhone(){
      var val = document.getElementById('phone').value.trim();
      if (val === ''){setError('phone', 'phone-error', 'Phone number is required.'); return false;}
      var digits = '';
      for(var i = 0; i < val.length; i++){
        if (val.charCodeAt(i) >= 48 && val.charCodeAt(i) <= 57) digits += val[i];}
      if(digits.length < 8){ setError('phone', 'phone-error', 'Phone must have at least 8 digits.');
        return false; }
      setValid('phone', 'phone-error');
      return true;
    }

    /*
    cek credit card number, hrs 16 digit pas 
    */
    function validateCard(){
      var val = document.getElementById('cardnumber').value.trim();
      if(val === ''){ setError('cardnumber', 'carderror', 
        'Card number is required.'); return false;}
      var digits = '';
      for (var i = 0; i < val.length; i++){
        var c = val.charCodeAt(i);
        if(c >= 48 && c <= 57) digits += val[i];
        else if(val[i] !== ' ' && val[i] !== '-'){ setError('cardnumber', 'carderror', 
          'Card number must contain digits only.'); return false;}
      }
      if(digits.length !== 16){ setError('cardnumber', 'carderror', 
        'Card number must be exactly 16 digits.'); 
        return false;}
      setValid('cardnumber', 'carderror');
      return true;
    }

    /*
    jumlah game yang mau di beli minimal 1
    kalo kurang dari 1 kasih msg error Quantity must be at least 1
    */
    function validateQuantity(){
      var val = document.getElementById('quantity').value.trim();
      if (val === '' || Number(val) < 1 || val.indexOf('.') !== -1){
        setError('quantity', 'quantity-error', 'Quantity must be at least 1.');
        return false;
      }
      setValid('quantity', 'quantity-error');
      return true;
    }

    /*
    buat terms of aggrement pas purchase, hrs di ceklist
    */
    function validateTerms(){
      var cb = document.getElementById('terms');
      var msg = document.getElementById('terms-error');
      if(!cb.checked){
        if (msg){msg.textContent = 'You must agree to the terms.'; msg.classList.add('show');}
        return false;
      }
      if(msg) msg.classList.remove('show');
      return true;
    }

    /*
    nomor kartu lgsung di format setiap 4 nomor
    */
    var cardField = document.getElementById('cardnumber');
    if (cardField){
      cardField.addEventListener('input', function(){
        var raw = '';
        for (var i = 0; i < this.value.length; i++){
          if (this.value.charCodeAt(i) >= 48 && this.value.charCodeAt(i) <= 57) raw += this.value[i];
        }
        raw = raw.substring(0, 16);
        var formatted = '';
        for(var j = 0; j < raw.length; j++){
          if(j > 0 && j % 4 === 0) formatted += ' ';
          formatted += raw[j];
        }
        this.value = formatted;
      });
    }



    /*
    abis purchase form udah di submit sukses
    */
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = validateEmail() & validatePhone() & validateCard() & validateQuantity() & validateTerms();
      if(ok){
        document.querySelector('.formcard').innerHTML = 
        container.innerHTML = `
        <div class="successbox">
          <p>🎉</p>
          <h2>Order Placed!</h2>
          <p>Your game key will be sent to your email shortly.</p>
          <a href="#" data-page="page-home" class="btn btn-green">Back to Home</a>
        </div>`;

        document.querySelectorAll('[data-page]').forEach(function (link){
          link.addEventListener('click', function (e){
            e.preventDefault();
            showPage(this.getAttribute('data-page'));
          });
        });
      }
    });
  }

});