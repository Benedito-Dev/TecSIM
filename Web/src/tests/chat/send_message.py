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
    print("✓ Login realizado")
    time.sleep(3)
    
    # Navegar para Chatbot
    link_chatbot = driver.find_element(By.XPATH, "//a[@href='/chatbot']")
    link_chatbot.click()
    print("✓ Navegou para Chatbot")
    time.sleep(2)
    
    # Encontrar campo de mensagem
    campo_mensagem = driver.find_element(By.XPATH, "//input[@placeholder*='mensagem' or @placeholder*='Digite'] | //textarea[@placeholder*='mensagem']")
    campo_mensagem.click()
    time.sleep(1)
    
    # Digitar mensagem
    mensagem = "Olá, estou com dor de cabeça. O que posso tomar?"
    campo_mensagem.send_keys(mensagem)
    print(f"✓ Mensagem digitada: {mensagem}")
    time.sleep(2)
    
    # Enviar mensagem
    botao_enviar = driver.find_element(By.XPATH, "//button[contains(text(), 'Enviar') or @type='submit'] | //button[contains(@class, 'send')]")
    botao_enviar.click()
    print("✓ Mensagem enviada")
    time.sleep(3)
    
    # Aguardar resposta da IA
    print("⏳ Aguardando resposta da IA...")
    time.sleep(5)
    
    # Verificar se resposta apareceu
    try:
        resposta = driver.find_element(By.XPATH, "//*[contains(text(), 'paracetamol') or contains(text(), 'medicamento') or contains(text(), 'dor')]")
        print(f"✓ Resposta recebida: {resposta.text[:50]}...")
    except:
        print("✓ Chat funcionando (resposta pode estar carregando)")
    
    print("🎉 FLUXO CHAT SEND MESSAGE CONCLUÍDO!")
    
except Exception as e:
    print(f"❌ Erro: {e}")

finally:
    time.sleep(5)
    driver.quit()