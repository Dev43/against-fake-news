## compute_input.py

import sys, json
from modules.newsScrapper import NewsScrapper

#Read data from stdin
print("hello")

# def main():
#     #get our data as an array from read_in()
#     lines = read_in()

#     #create a numpy array
#     np_lines = np.array(lines)

#     #use numpys sum method to find sum of all elements in the array
#     lines_sum = np.sum(np_lines)

#     #return the sum to the output stream
#     print lines_sum

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    url = read_in()   # url = "http://yahoo.com"
    print(url)
    # url = "http://yahoo.com"
    # url = json.loads(lines[0])
    scraper = NewsScrapper(url)
    print(scraper.sources)
    result = json.dumps({"source": scraper.sources, "text": scraper.text})
    # print("hello")
    print(result)
    # return result

if __name__ == '__main__':
    main()



