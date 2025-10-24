from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
driver.get("http://localhost:5173/login")

try:
    # Espera os elementos carregarem
    wait = WebDriverWait(driver, 10)
    
    # Preenche email
    input_email = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    input_email.send_keys("beneditobittencourtt@gmail.com")
    
    # Preenche senha
    input_senha = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
    input_senha.send_keys("Rayane15.")
    
    # Clica em Entrar
    botao_entrar = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Entrar')]")))
    botao_entrar.click()
    
    # Aguarda login
    time.sleep(3)
    
    # Teste de toggle da sidebar - abrir e fechar múltiplas vezes
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    
    # Abrir sidebar
    botao_menu.click()
    print("Sidebar aberta")
    time.sleep(1)
    
    # Fechar sidebar
    botao_menu.click()
    print("Sidebar fechada")
    time.sleep(1)
    
    # Abrir novamente
    botao_menu.click()
    print("Sidebar aberta novamente")
    time.sleep(1)
    
    # Fechar novamente
    botao_menu.click()
    print("Sidebar fechada novamente")
    time.sleep(1)
    
    # Deixar aberta para verificar funcionamento
    botao_menu.click()
    print("Sidebar deixada aberta para verificacao")
    time.sleep(2)
    
    print("Teste de toggle da sidebar concluido com sucesso!")
    
except Exception as e:
    print(f"Erro: {e}")

time.sleep(3)
driver.quit()