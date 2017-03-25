## compute_input.py

import sys, json
from modules.newsScrapper import NewsScrapper

#Read data from stdin

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    url = read_in()   # url = "http://yahoo.com"
    # url = "http://abcnews.com.co/obama-executive-order-bans-pledge-of-allegiance-in-schools/"
    # url = json.loads(lines[0])
    scraper = NewsScrapper(url)
    # print(scraper.sources)
    result = json.dumps({"source": scraper.sources, "text": scraper.text})
    # print("hello")
    print(result)
    # return result

if __name__ == '__main__':
    main()



