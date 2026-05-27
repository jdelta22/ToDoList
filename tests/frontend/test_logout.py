from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.alert import Alert
import uuid
import time

def test_nav_logout(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()

    time.sleep(2)

    button = driver.find_element(By.XPATH, "//*[@id='root']/nav/div/div/button")
    button.click()
    time.sleep(2)

    assert driver.current_url == "http://localhost:5173/login"

def test_sidebar_logout(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()

    time.sleep(2)

    button = driver.find_element(By.CLASS_NAME, "sidebar-logout")
    button.click()
    time.sleep(2)

    assert driver.current_url == "http://localhost:5173/login"

    