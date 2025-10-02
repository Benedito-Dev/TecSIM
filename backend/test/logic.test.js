const retornarstring = require("./logic")

test("Contando as letras de casa", () => {
    expect(retornarstring("casa")).toHaveLength(4)
})