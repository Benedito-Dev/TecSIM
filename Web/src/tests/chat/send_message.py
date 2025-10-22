from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# FLUXO: ENVIAR MENSAGEM NO CHATBOT

driver = webdriver.Chrome()

try:
    # Login
    driver.get("http://localhost:5173")
    time.sleep(2)
    
    botao_entrar = driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar')]")
    botao_entrar.click()
    time.sleep(1)
    
    input_email = driver.find_element(By.XPATH, "//input[@type='email']")
    input_email.send_keys("beneditobittencourtt@gmail.com")
    time.sleep(1)
    
    input_senha = driver.find_element(By.XPATH, "//input[@type='password']")
    input_senha.send_keys("Rayane15.")
    time.sleep(1)
    
    botao_login = driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar como Enfermeiro')]")
    botao_login.click()
    print("Login realizado")
    time.sleep(3)
    
    # Navegar para Chatbot
    link_chatbot = driver.find_element(By.XPATH, "//a[@href='/chatbot']")
    link_chatbot.click()
    print("Navegou para Chatbot")
    time.sleep(2)
    
    # Encontrar campo de mensagem
    try:
        campo_mensagem = driver.find_element(By.XPATH, "//input[contains(@placeholder, 'mensagem')]")
    except:
        try:
            campo_mensagem = driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Digite')]")
        except:
            try:
                campo_mensagem = driver.find_element(By.XPATH, "//textarea[contains(@placeholder, 'mensagem')]")
            except:
                campo_mensagem = driver.find_element(By.XPATH, "//input[@type='text']")
    print("Campo de mensagem encontrado")
    campo_mensagem.click()
    time.sleep(1)
    
    # Digitar mensagem
    mensagem = "Olá, estou com dor de cabeça. O que posso tomar?"
    campo_mensagem.send_keys(mensagem)
    print(f"Mensagem digitada: {mensagem}")
    time.sleep(2)
    
    # Enviar mensagem - tentar diferentes seletores
    botao_enviar = None
    try:
        botao_enviar = driver.find_element(By.XPATH, "//button[contains(text(), 'Enviar')]")
    except:
        try:
            botao_enviar = driver.find_element(By.XPATH, "//button[@type='submit']")
        except:
            try:
                botao_enviar = driver.find_element(By.XPATH, "//button[contains(@class, 'send')]")
            except:
                try:
                    botao_enviar = driver.find_element(By.XPATH, "//button[.//svg]")
                except:
                    # Usar Enter como alternativa
                    from selenium.webdriver.common.keys import Keys
                    campo_mensagem.send_keys(Keys.RETURN)
                    print("Mensagem enviada com Enter")
                    botao_enviar = "enter_usado"
    
    if botao_enviar and botao_enviar != "enter_usado":
        print("Botao enviar encontrado")
        botao_enviar.click()
        print("Mensagem enviada")
    elif not botao_enviar:
        print("Nenhum botao de envio encontrado")
    time.sleep(3)
    
except Exception as e:
    print(f"Erro: {e}")

finally:
    time.sleep(5)
    driver.quit()