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
    
    # Clica em Perfil
    botao_Perfil = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Perfil']")))
    botao_Perfil.click()
    time.sleep(1)

    # Clica em Perfil
    botao_editar_Perfil = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Editar Perfil']")))
    botao_editar_Perfil.click()

    # Localiza o campo de input de texto (mais genérico)
    campo_mensagem = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//input[@type='text']"))
    )

    # Limpa o campo antes de digitar
    campo_mensagem.clear()

    time.sleep(1)

    # Digita a nova mensagem
    mensagem = "Leonardo"
    campo_mensagem.send_keys(mensagem)
    print(f"Mensagem digitada: {mensagem}")
    time.sleep(1)

    botao_salvar = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Salvar Alterações')]")))
    botao_salvar.click()
    
    print("✓ Perfil Atualizado com sucesso!")
    
except Exception as e:
    print(f"Erro: {e}")

time.sleep(3)
driver.quit()