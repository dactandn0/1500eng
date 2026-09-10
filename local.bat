  REM python -m SimpleHTTPServer 8000

  REM Server tinh + Edge TTS proxy (de nghe dung giong Edge: Aria/Jenny/Guy...).
  REM Browser goi WSS truc tiep hay bi 403 (Origin/UA) -> can chay file nay
  REM thay cho `python -m http.server 8888`.
  python edge_proxy.py 8888