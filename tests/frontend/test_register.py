from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.alert import Alert
import uuid
import time

def test_register(driver):
    username_value = str(uuid.uuid4())[:8]
    driver.get("http://localhost:5173/register")
    username = driver.find_element(By.XPATH, "//input[@placeholder='Usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")
    email = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
    username.send_keys(f"teste_{username_value}")
    password.send_keys("1234")
    email.send_keys(f"teste_{username_value}@teste.com")
    button = driver.find_element(By.CLASS_NAME, "register-button")
    button.click()
    time.sleep(5)
    alert = Alert(driver)
    assert alert.text == "Conta criada com sucesso"
    alert.accept()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/login"

