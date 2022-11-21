let myPromise = () => {
    return new Promise((resolve, reject) => {
        if (condition) {
            console.log('Test myPromise OK');
            resolve();
        } else {
            console.log('Test myPromise Pas OK');
            reject();
        }
    });
}


// Resolve promise. 

let handleMyPromise = async (e) => {
    e.preventDefault();
    try {
        await myPromise();
    }
    catch (err) {
        console.log('err :', err);
    }
}; 