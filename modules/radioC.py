import requests
import json
from bs4 import BeautifulSoup


class RadioRelated():
    def __init__(self, title=None):
        self.title = title


    def getRelated(self):
        links = []
        for i in range(0, 2):
            if links != []:
                break
            url = 'https://news.google.com/news'
            siteConstraint= 'site:ici.radio-canada.ca'
            q = (self.title+siteConstraint, siteConstraint)
            params = {'q' : q[i], 'output': 'rss', 'hl':'fr', 'as_sitesearch': 'ici.radio-canada.ca'}

            r = requests.get(url, params=params)

            soup = BeautifulSoup(r.text, 'lxml')
            items = [item for item in soup.find_all('item')]
            for item in items:
                link = ''
                breakCheck = 0
                for it in item.find_all('guid'):
                    for i in range(0, len(it.text)-1):
                        if (it.text)[i:i+4] == 'http':
                            while True:
                                try:
                                    link += (it.text)[i]
                                except IndexError:
                                    links.append(link)
                                    breakCheck = 1
                                    break
                                i += 1
                    if breakCheck == 1:
                        break

        '''
            print(item.text)
            for i in range(0, len(item)-1):
                line = ''
                if str(item[i:i+8]) == 'cluster':
                    while True:
                        if str(item[i+1:i+5]) != '</guid>':
                            break
                        line += str(item[i])
        '''    

        return links
        

    def neuroCanada(self, RC_url):
        articles = []
        if type(RC_url) == type(''):
            RC_url = [RC_url]
        for url in RC_url:
            neuroInput = self._parseRcLink(url)
            url = ('https://services.radio-canada.ca/hackathon2017/neuro/v1/{0}/{1}'.format(neuroInput[0], neuroInput[1]))
            headers = {'authorization': 'Client-Key 31e51cda-4ab0-4234-83c2-25d503c69487'}
            r = requests.get(url, headers=headers)
            article = json.loads(r.text)
            try:
                alt = article['summaryMultimediaItem']['alt']
                href = article['summaryMultimediaItem']['concreteImages'][0]['mediaLink']['href']
            except (KeyError, TypeError):
                alt = "Image de l'article"
                try:
                    href = article['summaryMultimediaContentForDetail']['summaryImage']['concreteImages'][0]['mediaLink']['href'] 
                except KeyError:
                    try:
                        href = article['summaryMultimediaItem']['concreteImages'][0]['mediaLink']['href']
                    except TypeError: 
                        href = None
                articles.append({
                'link': article['selfLink'], 
                'title': article['title'], 
                'summary': article['summary'], 
                'image':{
                    'alt': alt, 
                    'href': href 
                    }
                })
        return articles


    def _parseRcLink(self, url):
        urlL = url.split('/')
        contentType = {'nouvelle': 'news-stories', 'breve': 'short-contents'}
        if urlL[3] in contentType:
                urlL[3] = contentType[urlL[3]]
        return (urlL[3], urlL[4])

#RR = RadioRelated('Drug Kingpin Joaquin')
#links = RR.getRelated()
#articles = RR.neuroCanada(links)
