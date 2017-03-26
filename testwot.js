
const urls = {
    noDate: [
        'http://viralmugshot.com/trump-offering-free-one-way-tickets-to-africa-mexico-for-those-who-wanna-leave-america/'
    ],
    dateInUrl: [
        'https://thevalleyreport.com/2016/04/25/woman-arrested-for-defecating-on-boss-desk-after-winning-the-lottery/'
    ],
    dateInText: [
        'http://fr.novopress.info/204581/drame-evite-a-anvers-un-terroriste-ou-un-vrai-desequilibre/'
    ],
    dateInUrlAndText: [
        'http://www.legorafi.fr/2017/03/24/un-membre-du-cabinet-noir-de-francois-hollande-en-arrive-a-douter-de-sa-propre-existence/',
        'http://www.breitbart.com/london/2017/03/24/pictured-police-release-mugshot-westminster-killer-khalid-masood/'
    ]
};

require('./services/dateCheck').check(urls.dateInText[0]).then(date => {
    console.log(date);
}).catch(reason => {
    console.log(reason);
});
