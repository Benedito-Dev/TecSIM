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
    
    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)
    
    # Clica em Clientes
    botao_clientes = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Clientes']")))
    botao_clientes.click()

    # Clica em Novo Cliente
    botao_novo_cliente = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Novo Cliente']")))
    botao_novo_cliente.click()
    
    print("✓ Logout realizado com sucesso!")
    
except Exception as e:
    print(f"Erro: {e}")

time.sleep(3)
driver.quit()