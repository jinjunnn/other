#   学习笔记
### 算法
    1.文档追加存储
        with open('/Users/mac/spader/s.json','a',encoding='utf-8') as f:
        f.write('Hello, world!')
        W代表写入， a代表追加   encoding='utf-8'

    2.设置定时器延迟执行
        import threading as thd
        import time
        def fn():
            print(time.time())
            thd.Timer(10,fn).start() 
        fn()