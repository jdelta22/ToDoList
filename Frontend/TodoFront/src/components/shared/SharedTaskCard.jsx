function SharedTaskCard({
  task,
  onRevoke,
}) {  

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">

      <div className="flex items-center justify-between gap-4">

        <div>

          <h2 className="text-xl font-semibold text-gray-800">
            {task.title}
          </h2>

          <p className="text-gray-600 mt-2">
            {task.description}
          </p>

        </div>

        <div>

          {task.is_public ? (

            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
              Pública
            </span>

          ) : (

            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
              Privada
            </span>

          )}

        </div>

      </div>

      <div className="flex flex-wrap gap-2 my-4">

        {task.categories.map((category) => (

          <span
            key={category.id}
            className="text-white text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: category.color
            }}
          >
            {category.name}
          </span>

        ))}

      </div>

      <div className="space-y-4">

        {task.users.map((user) => (

          <div
            key={user.id}
            className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100"
          >

            <div>

              <p className="font-medium text-gray-800">
                {user.username}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {user.can_edit ? (

                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    Pode editar
                  </span>

                ) : (

                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                    Somente leitura
                  </span>

                )}

                {user.accepted ? (

                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    Aceito
                  </span>

                ) : (

                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                    Pendente
                  </span>

                )}

                {user.completed ? (

                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    Concluiu
                  </span>

                ) : (

                  <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                    Não concluiu
                  </span>

                )}

              </div>

            </div>

            <button
              onClick={() => onRevoke(task.id, user.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition"
            >
              Revogar acesso
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default SharedTaskCard