import requests
import json
from bs4 import BeautifulSoup
#from sklearn.feature_extraction.text import CountVectorizer
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import urllib3
from urllib.parse import urlparse


urllib3.disable_warnings()
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


class NewsScrapper():
    def __init__(self, link):
            self.link = link
            self.html = self._getHtml()
            self.text = self.scrap()
            self.links = self._getLinks()
            self.sources = self.getSource()
            self.title = self._getTitle()


    def scrap(self):

        r = self.html
        soup = BeautifulSoup(r.text, 'lxml')
        #clean the received html
        html_cleaned = self._cleanHtml(soup)

        #create a dictionary structure {company : {index : {site,
        #raw_text}
        dataText = html_cleaned
        return dataText

    def getSource(self):
        links = self.links
        sources = set()
        hostname = (urlparse(self.link).hostname)[4:] if (urlparse(self.link).hostname)[:4] == 'www.' else urlparse(self.link).hostname
        for link in links:
            prsd = urlparse(link)
            if prsd.hostname != None and hostname not in prsd.hostname:
                sources.add(prsd.hostname)
        sources = [source for source in sources]
        return sources


    def _getHtml(self):
        l = self.link
        # make sure link starts with http in order to scrap it
        if l[0:4] != 'http':
                l = 'http://'+l
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'}
        r = requests.get(l, headers=headers)

        '''
        except:
                print('Error over here !')
                data_dict = {'url': l, 'raw_text': None}
                company_dict[index] = data_dict
                index += 1
                continue
        '''
        if r.status_code // 100 != 2:
                print(r.status_code)
                return None
        return r

    def _cleanHtml(self, html):
        for script in html(["script", "style"]): # remove all javascript and stylesheet code
                script.extract()
        # get text
        text = html.get_text()
        # break into lines and remove leading and trailing space on each
        lines = (line.strip() for line in text.splitlines())
        # break multi-headlines into a line each
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        # drop blank lines
        text = '. '.join(chunk for chunk in chunks if chunk)
        return text

    def _getLinks(self):
        r = self.html
        soup = BeautifulSoup(r.text, 'lxml')
        links = []
        for link in soup.find_all('a'):
                links.append(link.get('href'))
        return links

    def _getTitle(self):
        r = self.html
        soup = BeautifulSoup(r.text, 'lxml')
        return (soup.find('h1')).string


'''
        def mine(self, search_engine = 'google_scrap', count = 5):


                link_lists = []

                #For Bing search engine
                if search_engine == 'bing':
                        url='https://api.cognitive.microsoft.com/bing/v5.0/search?q='+self.company+'&count='+str(count)
                        header = {'ocp-apim-subscription-key': '386047532b4243369df5e5abd2c76dab'}
                        r = requests.get(url, headers=header, verify=False)
                        try :
                                r_json = r.json()
                        except ValueError:
                                return None

                        for link in r_json["webPages"]["value"]:
                                links_list.append(link["url"])

                                return links_list

               #TODO For Google search engine
                elif search_engine == 'google':
                        url  = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCKOXT3npc_zHa3VTDMTkT6erzeKhu3FN0&q='+self.company+'&cx=001235176516091570544:z2abylo6azu'
                        header = None
                        r = requests.get(url, headers=header, verify=False)
                        return r

                #Scrap google's link via bs
                elif search_engine == 'google_scrap':
                        url = 'https://www.google.com/search'
                        params = {'q':self.company}
                        #url = 'https://www.google.com/search?q='+self.company
                        r = requests.get(url, params=params, verify=False)
                        soup = BeautifulSoup(r.content, 'lxml')
                        for li in soup.findAll('h3', attrs={'class':'r'})[:count]:
                                glink = li.find('a')
                                glink = glink['href'].replace('/url?q=', '')
                                trunc = glink.index('&sa')
                                glink = glink[:trunc]
                                #dump links to goole own page
                                if glink[0] == '/':
                                        continue
                                link_lists.append(glink)
                        return link_lists
'''
'''
        def tokenize(self, data):
                if type(data) == str:
                        data = [data]


                count_vect = CountVectorizer(stop_words = "english")
                Z = count_vect.fit_transform(data)
                print(count_vect.get_feature_names())
                exit()


'''
