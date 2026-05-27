from selenium.webdriver.common.by import By
import time


def test_import_public_task(driver):

    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    tasks = driver.find_elements(By.CLASS_NAME, "task-card")
    task = tasks[0]

    task.find_element(By.CLASS_NAME, "share-button").click()
    time.sleep(2)

    if driver.find_element(By.CLASS_NAME, "public-button").text == "Tornar pública":
        driver.find_element(By.CLASS_NAME, "public-button").click()
        alert = driver.switch_to.alert
        alert.accept()
        time.sleep(2)
    else:
        pass
        
    time.sleep(2)

   
    driver.find_element(By.CLASS_NAME, "copy-button").click()
    time.sleep(2)
    alert = driver.switch_to.alert
    alert.accept()
    time.sleep(2)

    copied_text = driver.execute_async_script("""
        const callback = arguments[arguments.length - 1];

        navigator.clipboard.readText()
        .then(text => callback(text))
        .catch(err => callback("ERROR"));
    """)

    share_link = driver.find_element(By.CLASS_NAME, "public-link-input")
    link = share_link.get_attribute("value")
    assert copied_text == link

