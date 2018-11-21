from bs4 import BeautifulSoup
import requests
url = 'https://www.kaola.com/'

web_data = requests.get(url)

soup = BeautifulSoup(web_data.text , 'lxml')

titles = soup.select('.navitm')

for title in titles:
    data = title.get_text()
    print(data)
