import { render, screen } from "@testing-library/react"
import { TaskList } from "@/components/tasks/TaskList"

jest.mock("@/hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [{ id: "1", title: "Test Task" }],
    loading: false,
    deleteTask: jest.fn(),
  }),
}))

describe("TaskList", () => {
  it("renders tasks correctly", () => {
    render(<TaskList />)
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })
})