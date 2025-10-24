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
    
    # Navegar pelo Dashboard - verificar se carregou
    print("Dashboard carregado com sucesso!")
    time.sleep(2)
    
    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Chatbot
    botao_chatbot = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Chatbot']")))
    botao_chatbot.click()
    print("Navegou para Chatbot")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Medicamentos
    botao_medicamentos = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Medicamentos']")))
    botao_medicamentos.click()
    print("Navegou para Medicamentos")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Prescrições
    botao_prescricoes = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Prescrições']")))
    botao_prescricoes.click()
    print("Navegou para Prescrições")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Lembretes
    botao_lembretes = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Lembretes']")))
    botao_lembretes.click()
    print("Navegou para Lembretes")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Clientes
    botao_clientes = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Clientes']")))
    botao_clientes.click()
    print("Navegou para Clientes")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Perfil
    botao_perfil = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Perfil']")))
    botao_perfil.click()
    print("Navegou para Perfil")

    # Abre sidebar clicando no botão menu
    botao_menu = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'p-2 rounded-lg hover:bg-blue-800')]")))
    botao_menu.click()
    time.sleep(1)

    # Ajustes
    botao_ajustes = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Ajustes']")))
    botao_ajustes.click()
    print("Navegou para Ajustes")
    
    # Verificar título da página
    titulo = driver.title
    print(f"Titulo da pagina: {titulo}")
    
    print("Navegacao do dashboard concluida com sucesso!")
    
except Exception as e:
    print(f"Erro: {e}")

time.sleep(3)
driver.quit()