## compute_input.py

import sys, json
from modules.newsScrapper import NewsScrapper
from modules.radioC import RadioRelated

#Read data from stdin

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #url = read_in()   # url = "http://yahoo.com"
    url = "http://abcnews.com.co/breaking-capitol-hill-shooter-identified-as-right-wing-extremist/"
    scraper = NewsScrapper(url)
    Rr = RadioRelated(scraper.title)
    links = Rr.getRelated()
    result = json.dumps({"source": scraper.sources, "text": scraper.text, "scoreTitle": scraper.titleScore, "title": scraper.title, "relatedArticles": Rr.neuroCanada(links)})
    print(result)

if __name__ == '__main__':
    main()



