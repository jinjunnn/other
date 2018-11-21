import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException#用来处理超时异常
from pyquery import PyQuery as pq#用来解析网页源码


choice = ['--load-images=false','--disk-cache=true']#PhantomJS的api，不加载图片，开启缓存
browser = webdriver.PhantomJS(service_args=choice)#选择PhantomJS浏览器并加入参数
browser.set_window_size(1400,900)#设置浏览器窗口大小，便于selenium运行
waite = WebDriverWait(browser, 10)#设置等待时间
key = '彩妆'#设置需要搜索的关键字
def search():
    print('搜索中')
    try:
        browser.get('https://www.kaola.com')
        # 用来关闭弹窗
        close = waite.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#index-netease-com > table > tbody > tr > td > div > div > div > div > div.modal-body > div > div.u-close"))
            )
        # 用来输入搜索内容
        input = waite.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#topSearchInput"))#用css_selector检索
            )
        #用这个方法去点击，select会受上一次select的影响，从而使click失效
        #submit = waite.until(
                #EC.element_to_be_clickable((By.XPATH, "//*[@id='topSearchBtn']"))
            #)
        close.click()
        input.send_keys(key)
        #submit.click()
        # 上面click点击失效的问题用此法解决了   js大法好
        #用来点击搜索
        js = 'document.getElementsByClassName("w-icon w-icon-27")[0].click();'
        browser.execute_script(js)
        print('当前正在第 1 页')
        get_products()
    except TimeoutException:
        return search()

def next_page():
    try:
        click_next = waite.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#resultwrap > div.splitPages > a.nextPage"))
            )
        click_next.click()
        now_page = browser.find_element_by_xpath("//*[@id='resultwrap']/div[3]/span[1]").text#用xpath方法检索
        print('当前正在第', now_page, '页')
        time.sleep(1)
        get_products()
        return next_page()
    #这里最后一页不存在下一页按钮，所以处理必定超时，可以用这个超时来判断是否翻页完毕
    except TimeoutException:
        end_page = browser.find_element_by_xpath("//*[@id='resultwrap']/div[3]/span[1]").text
        print('翻页完毕，第',end_page,'页')
        print('存储完毕')

def get_products():
    waite.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#result > li > div"))
        )
    html = browser.page_source#用这个语句拿到整个网页的源代码
    doc = pq(html)#用PyQuery解析
    goods = doc("#result > li > div").items()
    kaola_url = 'https://www.kaola.com'
    for good in goods:
        #用find方法检索
        product = {
            'good_name': good.find('.title').text(),
            'price': good.find('.cur').text(),
            'comment':good.find('.comments').text(),
            'origin':good.find('.proPlace.ellipsis').text(),
            'store':good.find('.selfflag').text(),
            'url':kaola_url + good.find('.title').attr('href')
        }
        save_data(product)

def save_data(data):
    try:
        print('存储成功：',data)
    except Exception:
        print('存储失败：',data)

if __name__ == "__main__":
    try:
        search()
        next_page()
    except Exception:
        print('出错啦')
    finally:
        browser.close()#记得关闭浏览器
