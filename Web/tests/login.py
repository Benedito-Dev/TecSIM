from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Abre o navegador Chrome
driver = webdriver.Chrome()

# Abre o Google (opcional)
driver.get("http://localhost:5173")

time.sleep(2)

# Pelo texto "Entrar" - mais confiável
botao_entrar = driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar')]")
botao_entrar.click()
print("✓ Botão 'Entrar' clicado")

time.sleep(1)

# 1. PREENCHE O EMAIL
input_email = driver.find_element(By.XPATH, "//input[@type='email']")
input_email.send_keys("beneditobittencourtt@gmail.com")  # Substitua pelo email real
print("✓ Email preenchido")

time.sleep(1)

# 2. PREENCHE A SENHA
input_senha = driver.find_element(By.XPATH, "//input[@type='password']")
input_senha.send_keys("Rayane15.")  # Substitua pela senha real
print("✓ Senha preenchida")

time.sleep(1)

# Pelo texto "Entrar como enfermeito" - mais confiável
botao_entrar = driver.find_element(By.XPATH, "//button[contains(text(), 'Entrar como Enfermeiro')]")
botao_entrar.click()
print("✓ Botão 'Entrar' clicado")

# Espera 3 segundos para você ver a página
time.sleep(10)

# Fecha o navegador
driver.quit()

print("Navegador aberto e fechado com sucesso!")