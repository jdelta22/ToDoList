from selenium.webdriver.common.by import By
import time


def test_navbar_home_button(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"


    driver.find_element(By.XPATH, '//*[@id="root"]/nav/div/div/a[1]').click()
    assert driver.current_url == "http://localhost:5173/"

def test_navbar_dashboard_button(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"


    driver.find_element(By.XPATH, '//*[@id="root"]/nav/div/div/a[2]').click()
    assert driver.current_url == "http://localhost:5173/dashboard"

def test_navbar_shared_button(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"


    driver.find_element(By.XPATH, '//*[@id="root"]/nav/div/div/a[3]').click()
    assert driver.current_url == "http://localhost:5173/shared"

def test_navbar_received_button(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)
    assert driver.current_url == "http://localhost:5173/dashboard"


    driver.find_element(By.XPATH, '//*[@id="root"]/nav/div/div/a[4]').click()
    assert driver.current_url == "http://localhost:5173/received"
