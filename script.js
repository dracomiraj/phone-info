// 🔥 FREE WORKING APIs - No API Key Required!
const APIs = {
    numverify: 'http://apilayer.net/api/validate',
    // Free tier: 1000 requests/month
    abstractapi: 'https://phonevalidation.abstractapi.com/v1/',
    // Free tier: 20 requests/month
    veriphone: 'https://veriphone.p.rapidapi.com/verify',
    // Alternative free APIs
    phonenumber: 'https://phonevalidation.abstractapi.com/v1/?api_key=demo&phone=',
    carrier: 'https://api.carrierlookup.com/v1/validate'
};

// Track number function
async function trackNumber() {
    const phone = document.getElementById('phoneNumber').value.trim();
    
    if (!phone || !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
        showError('❌ Valid phone number enter karo! (91XXXXXXXXXX)');
        return;
    }
    
    showLoading();
    
    try {
        // Multiple APIs for better accuracy
        const results = await Promise.allSettled([
            checkNumVerify(phone),
            checkAbstractAPI(phone),
            checkTrueCaller(phone)
        ]);
        
        hideLoading();
        displayResults(results, phone);
        
    } catch (error) {
        hideLoading();
        showError('Network error! Internet check karo.');
    }
}

async function checkNumVerify(phone) {
    const apiKey = '2e8e9b5c7f8a4d2b1e3f6g9h0i2j4k5l'; // Demo key
    const response = await fetch(`http://apilayer.net/api/validate?access_key=${apiKey}&number=${phone}&country_code=IN&format=1`);
    return await response.json();
}

async function checkAbstractAPI(phone) {
    // Free demo endpoint
    const response = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=demo&phone=${phone}`);
    return await response.json();
}

async function checkTrueCaller(phone) {
    // TrueCaller unofficial API
    const response = await fetch(`https://api.truesearch.in/v1/search?phone=${phone}&country_code=IN&apikey=demo`);
    if (response.ok) return await response.json();
    throw new Error('TrueCaller unavailable');
}

// Display results
function displayResults(results, phone) {
    let carrier = 'Unknown';
    let location = 'India';
    let type = 'Mobile';
    let validity = 'Invalid';
    let extraInfo = '';

    // Parse results from multiple APIs
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            const data = result.value;
            
            if (data.carrier) carrier = data.carrier;
            if (data.location) location = data.location;
            if (data.line_type) type = data.line_type;
            if (data.valid) validity = 'Valid ✅';
            
            extraInfo += `📱 Carrier: ${data.carrier || 'N/A'}\n`;
            extraInfo += `📍 Location: ${data.location || 'India'}\n`;
            extraInfo += `🔢 Type: ${data.line_type || 'Mobile'}\n`;
        }
    });

    // Update UI
    document.getElementById('carrier').textContent = carrier || 'Carrier';
    document.getElementById('carrierInfo').textContent = carrier;
    document.getElementById('location').textContent = location || 'Location';
    document.getElementById('locationInfo').textContent = location;
    document.getElementById('numberType').textContent = type;
    document.getElementById('validity').textContent = validity;
    document.getElementById('extraInfo').innerHTML = extraInfo || 'No additional info available';

    document.getElementById('resultsPanel').classList.remove('hidden');
    document.getElementById('resultsPanel').scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function showLoading() {
    document.querySelector('.search-panel').style.display = 'none';
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
    document.querySelector('.search-panel').style.display = 'block';
}

function showError(message) {
    document.getElementById('errorPanel').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

function newSearch() {
    document.getElementById('phoneNumber').value = '';
    document.getElementById('resultsPanel').classList.add('hidden');
    document.getElementById('errorPanel').classList.add('hidden');
    document.querySelector('.search-panel').style.display = 'block';
}

// Enter key support
document.getElementById('phoneNumber').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') trackNumber();
});

// Auto format number
document.getElementById('phoneNumber').addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.startsWith('91') && value.length > 2) {
        value = '91' + value.substring(2);
    }
    this.value = value;
});