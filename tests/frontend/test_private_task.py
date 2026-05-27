from selenium.webdriver.common.by import By
import time


def test_invite_to_task(driver):

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

    driver.find_element(By.CLASS_NAME, "modal-input").send_keys("pedro")
    driver.find_element(By.CLASS_NAME, "invite-button").click()
    time.sleep(2)
    alert = driver.switch_to.alert
    assert alert.text == "Convite enviado"
    alert.accept()
    time.sleep(2)

    driver.find_element(By.CLASS_NAME, "close-button").click()
    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/a[2]').click()
    time.sleep(2)

    shared_tasks = driver.find_elements(By.XPATH, '//*[@id="root"]/div/main/div[2]/div')
    task = shared_tasks[0]

    assert task.find_element(By.XPATH, '//*[@id="root"]/div/main/div[2]/div/div[1]/div[1]/h2').text == "Tarefa para compartilhar"

def test_shared_task_revoke(driver):
    driver.get("http://localhost:5173/login")

    username = driver.find_element(By.XPATH, "//input[@placeholder='Nome de usuário']")
    password = driver.find_element(By.XPATH, "//input[@placeholder='Senha']")

    username.send_keys("joao")
    password.send_keys("1234")

    button = driver.find_element(By.CLASS_NAME, "auth-button")
    button.click()
    time.sleep(2)

    driver.find_element(By.XPATH, '//*[@id="root"]/div/div/aside/div[2]/nav/a[2]').click()
    time.sleep(2)

    shared_tasks = driver.find_elements(By.XPATH, '//*[@id="root"]/div/main/div[2]/div')
    task = shared_tasks[0]

    task.find_element(By.XPATH, '//*[@id="root"]/div/main/div[2]/div/div[3]/div/button').click()
    time.sleep(2)
    driver.refresh()

    shared_tasks = driver.find_elements(By.XPATH, '//*[@id="root"]/div/main/div[2]/div')
 
    assert shared_tasks == []