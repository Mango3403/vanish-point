export let login = false;
const ACCOUNT = 'Shintech2019';
const PASSWORD = '$HINEtech!';

let login_btn = document.querySelector('#login-btn');

login_btn.addEventListener('click', function () {
    let account = document.querySelector('#account');
    let pwd = document.querySelector('#password');

    if (account.value === ACCOUNT && pwd.value === PASSWORD) {
        login = true;
    } else {
        alert('账号或密码错误');
        console.log(account.value);
        console.log(pwd.value);
    }
});