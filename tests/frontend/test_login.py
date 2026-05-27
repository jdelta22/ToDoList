from selenium.webdriver.common.by import By
import time


def test_login(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"

def test_login_invalid(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("senhaerrada")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/login"

